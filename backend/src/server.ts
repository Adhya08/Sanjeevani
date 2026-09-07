import Fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyRateLimit from '@fastify/rate-limit'
import { WebSocket } from 'ws'
import * as fs from 'fs'
import * as path from 'path'

// Mock database store
interface Listing {
  id: string
  orgId: string
  orgName: string
  produceType: string
  quantityTotal: number
  quantityAvailable: number
  pricePerKg: number
  harvestOrArrivalTs: string
  storageTemp: number
  storageHumidity: number
  wasteRiskScore: number
  estimatedDaysRange: [number, number]
  confidence: number
  riskTier: 'fresh' | 'slight' | 'moderate' | 'high' | 'critical'
  status: 'active' | 'low_stock' | 'closed' | 'rescued'
  city: string
  distanceKm: number
  createdAt: string
  updatedAt: string
}

interface Order {
  id: string
  listingId: string
  buyerOrgId: string
  quantity: number
  negotiatedPrice: number
  status: 'placed' | 'negotiating' | 'confirmed' | 'fulfilled' | 'rejected' | 'expired'
  createdAt: string
  updatedAt: string
}

interface AgentEvent {
  id: string
  sessionId?: string
  listingId?: string
  agentName: 'producer_agent' | 'buyer_agent' | 'system'
  eventType: string
  payload: Record<string, unknown>
  humanReadableText: string
  statusColor: 'amber' | 'blue' | 'green' | 'red'
  ts: string
}

// In-memory data store for live simulation
const listings: Record<string, Listing> = {}
const orders: Record<string, Order> = {}
const agentEvents: AgentEvent[] = []
const sessionSubscribers: Map<string, Set<WebSocket>> = new Map()

let listingIdCounter = 1
let orderIdCounter = 1
let eventIdCounter = 1

function getRiskTier(score: number): Listing['riskTier'] {
  if (score <= 20) return 'fresh'
  if (score <= 40) return 'slight'
  if (score <= 60) return 'moderate'
  if (score <= 80) return 'high'
  return 'critical'
}

const CITIES = ['Delhi', 'Gurgaon', 'Noida', 'Ghaziabad', 'Faridabad', 'Mehrauli', 'Dabri']
const ORG_NAMES = [
  'Ramesh Farms', 'Bhanu Agri', 'Gopal Traders', 'Sunita Produce', 'Ravi Harvest',
  'Verma Organic Farm', 'Kisan Co-operative', 'Greenfield Agro', 'Fresh India Farms',
  'Delhi Mandi Traders', 'Chaudhary Organic Crops', 'Sethi Distributors', 'Patel Veg Supply'
]
const PRODUCE_TYPES = [
  'Tomato', 'Potato', 'Onion', 'Cabbage', 'Carrot', 'Banana', 'Mango',
  'Apple', 'Orange', 'Spinach', 'Cauliflower', 'Grapes', 'Guava', 'Brinjal'
] as const

// ─── ML MODEL PARSER & EVALUATION ────────────────────────────────────────────

interface DecisionNode {
  feature?: string
  threshold?: number
  left?: number | DecisionNode
  right?: number | DecisionNode
}

let shelfLifeModel: {
  produce_mapping: Record<string, number>
  risk_tree: DecisionNode
  rem_days_tree: DecisionNode
} | null = null

let demandModel: {
  produce_mapping: Record<string, number>
  demand_tree: DecisionNode
} | null = null

function loadMLModels() {
  try {
    const candidateDirs = [
      path.join(__dirname, 'models'),
      path.join(__dirname, '..', 'src', 'models'),
      path.join(__dirname, '..', 'models'),
      path.join(process.cwd(), 'backend', 'src', 'models'),
      path.join(process.cwd(), 'src', 'models'),
      path.join(process.cwd(), 'models')
    ]

    let shelfLifePath = ''
    let demandPath = ''

    for (const dir of candidateDirs) {
      const sCandidate = path.join(dir, 'shelf_life_model.json')
      const dCandidate = path.join(dir, 'demand_model.json')
      if (!shelfLifePath && fs.existsSync(sCandidate)) {
        shelfLifePath = sCandidate
      }
      if (!demandPath && fs.existsSync(dCandidate)) {
        demandPath = dCandidate
      }
    }

    if (shelfLifePath) {
      shelfLifeModel = JSON.parse(fs.readFileSync(shelfLifePath, 'utf-8'))
      console.log(`Successfully loaded Shelf-Life model parameters from ${shelfLifePath}.`)
    } else {
      console.warn('Warning: Shelf-Life model JSON not found in candidate paths.')
    }

    if (demandPath) {
      demandModel = JSON.parse(fs.readFileSync(demandPath, 'utf-8'))
      console.log(`Successfully loaded Demand Prediction model parameters from ${demandPath}.`)
    } else {
      console.warn('Warning: Demand Prediction model JSON not found in candidate paths.')
    }
  } catch (err) {
    console.error('Failed to load ML model JSONs, falling back to heuristics.', err)
  }
}

// Evaluate recursive decision tree
function evaluateTree(node: number | DecisionNode, features: Record<string, number>): number {
  if (typeof node === 'number') {
    return node
  }
  const featureVal = features[node.feature!]
  if (featureVal === undefined) return 0
  if (featureVal <= node.threshold!) {
    return evaluateTree(node.left!, features)
  } else {
    return evaluateTree(node.right!, features)
  }
}

// Predict waste risk & shelf life using model
function getMLRiskScore(produceType: string, temp: number, hum: number, daysSinceHarvest: number): {
  riskScore: number
  remDays: [number, number]
  riskTier: Listing['riskTier']
} {
  if (!shelfLifeModel) {
    // Fallback heuristic
    const days = Math.floor(daysSinceHarvest)
    const tempFactor = (temp / 30) * 20
    const dayFactor = Math.min(days * 8, 50)
    const produceFactor = ['Tomato', 'Banana', 'Mango'].includes(produceType) ? 10 : 0
    const riskScore = Math.min(100, Math.floor(tempFactor + dayFactor + produceFactor + Math.random() * 5))
    const remainingDays = Math.max(1, 10 - days)
    const remDays: [number, number] = [Math.max(1, remainingDays - 2), remainingDays + 1]
    return { riskScore, remDays, riskTier: getRiskTier(riskScore) }
  }

  const produce_enc = shelfLifeModel.produce_mapping[produceType] ?? 0
  const features = { produce_enc, temp, hum, days_since_harvest: daysSinceHarvest }
  const riskScore = Math.min(100, Math.max(0, evaluateTree(shelfLifeModel.risk_tree, features)))
  const remDaysMean = evaluateTree(shelfLifeModel.rem_days_tree, features)

  const minDays = Math.max(1, Math.floor(remDaysMean * 0.8))
  const maxDays = Math.max(2, Math.ceil(remDaysMean * 1.2))

  return {
    riskScore: Math.round(riskScore),
    remDays: [minDays, maxDays],
    riskTier: getRiskTier(riskScore)
  }
}

// Predict demand suggested range
function getMLDemandForecast(
  produceType: string,
  buyerType: number,
  rollingAvg: number,
  month: number,
  isFestival: number,
  weatherRain: number,
  weatherHeat: number,
  priceLevel: number
): { min: number; max: number; rationale: string } {
  if (!demandModel) {
    const base = rollingAvg || 40
    return {
      min: Math.round(base * 0.9),
      max: Math.round(base * 1.1),
      rationale: `Steady weekly demand, avg ${Math.round(base)}kg`
    }
  }

  const produce_enc = demandModel.produce_mapping[produceType] ?? 0
  const features = {
    produce_enc,
    buyer_type: buyerType,
    rolling_avg: rollingAvg,
    month,
    is_festival: isFestival,
    weather_rain: weatherRain,
    weather_heat: weatherHeat,
    price_level: priceLevel
  }

  const demand = evaluateTree(demandModel.demand_tree, features)

  const parts: string[] = []
  if (isFestival) parts.push('festival peak')
  if (weatherRain) parts.push(produceType === 'Potato' ? 'monsoon rain' : 'monsoon wet weather')
  if (weatherHeat) parts.push('summer heat')
  parts.push(`price ₹${priceLevel}/kg`)

  const rationale = `Grounded recommendation based on rolling avg of ${rollingAvg}kg, accounting for: ${parts.join(', ')}.`
  return {
    min: Math.max(5, Math.round(demand * 0.85)),
    max: Math.max(10, Math.round(demand * 1.15)),
    rationale
  }
}

// Initialize seed data using ML predictions
function createMockListings() {
  loadMLModels()
  const orgIds = ['org_1', 'org_2', 'org_3', 'org_4', 'org_5']

  PRODUCE_TYPES.forEach((produce, i) => {
    for (let j = 0; j < 3; j++) {
      const id = `listing_${listingIdCounter++}`
      const orgId = orgIds[i % orgIds.length]
      const quantity = Math.floor(Math.random() * 500) + 50
      const price = Math.floor(Math.random() * 20) + 18
      const temp = 2 + Math.floor(Math.random() * 8)
      const hum = 80 + Math.floor(Math.random() * 15)
      const daysHarvested = j === 2 ? Math.floor(Math.random() * 4) + 6 : Math.floor(Math.random() * 3) + 1

      const { riskScore, remDays, riskTier } = getMLRiskScore(produce, temp, hum, daysHarvested)

      listings[id] = {
        id,
        orgId,
        orgName: ORG_NAMES[i % ORG_NAMES.length],
        produceType: produce,
        quantityTotal: quantity,
        quantityAvailable: quantity,
        pricePerKg: price,
        harvestOrArrivalTs: new Date(Date.now() - daysHarvested * 24 * 60 * 60 * 1000).toISOString(),
        storageTemp: temp,
        storageHumidity: hum,
        wasteRiskScore: riskScore,
        estimatedDaysRange: remDays,
        confidence: 0.82 + Math.random() * 0.15,
        riskTier,
        status: 'active',
        city: CITIES[i % CITIES.length],
        distanceKm: Math.floor(Math.random() * 25) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
  })
}

createMockListings()

// ─── FASTIFY ROUTING SETUP ───────────────────────────────────────────────────

const fastify = Fastify({ logger: true })

async function buildServer() {
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
  const allowedOrigins = frontendOrigin.split(',').map(o => o.trim().replace(/\/$/, ''))

  await fastify.register(fastifyCors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (like health checks, curl, mobile apps)
      if (!origin) return cb(null, true)
      const cleanOrigin = origin.replace(/\/$/, '')
      if (
        allowedOrigins.includes(cleanOrigin) ||
        allowedOrigins.includes('*') ||
        cleanOrigin === 'http://localhost:5173' ||
        cleanOrigin === 'http://127.0.0.1:5173'
      ) {
        return cb(null, true)
      }
      return cb(new Error('Not allowed by CORS'), false)
    },
    credentials: true,
  })

  await fastify.register(fastifyRateLimit, {
    max: 200,
    timeWindow: '1 minute',
  })

  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'sanjeevani-demo-secret-key',
    sign: { expiresIn: '1h' },
  })

  await fastify.register(fastifyWebsocket)

  // Health check endpoint for Render / cloud monitoring
  fastify.get('/health', async () => {
    return { status: 'ok' }
  })

  fastify.get('/api/v1/meta/produce-types', async () => {
    return { produceTypes: PRODUCE_TYPES }
  })


  // ─── AUTHENTICATION ROUTES ─────────────────────────────────────────────────

  fastify.post('/api/v1/auth/request-otp', async (request, reply) => {
    const { phone } = request.body as { phone: string }
    if (!phone) return reply.code(400).send({ error: 'Phone number is required' })
    return { message: 'OTP sent successfully (Simulated: use any 6 digits)', phone }
  })

  fastify.post('/api/v1/auth/verify-otp', async (request, reply) => {
    const { phone, otp, role } = request.body as { phone: string; otp: string; role: string }
    if (!phone || !otp) return reply.code(400).send({ error: 'Phone and OTP are required' })

    const token = fastify.jwt.sign({ phone, role, userId: `user_${phone}` })
    return { token, role, userId: `user_${phone}` }
  })

  // ─── LISTINGS ENDPOINTS ────────────────────────────────────────────────────

  fastify.get('/api/v1/listings', async (request, reply) => {
    const { produceType, maxPrice, maxDistanceKm, riskTier } = request.query as Record<string, string>
    let results = Object.values(listings).filter(l => l.status === 'active' || l.status === 'low_stock')

    if (produceType) results = results.filter(l => l.produceType === produceType)
    if (maxPrice) results = results.filter(l => l.pricePerKg <= parseFloat(maxPrice))
    if (riskTier) results = results.filter(l => l.riskTier === riskTier)

    results.sort((a, b) => a.wasteRiskScore - b.wasteRiskScore)
    return { listings: results, count: results.length }
  })

  fastify.get('/api/v1/listings/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const listing = listings[id]
    if (!listing) return reply.code(404).send({ error: 'Listing not found' })
    return { listing }
  })

  fastify.post('/api/v1/listings', async (request, reply) => {
    const body = request.body as {
      orgId?: string
      orgName?: string
      produceType: string
      quantityTotal: number
      pricePerKg: number
      harvestOrArrivalTs?: string
      storageTemp?: number
      storageHumidity?: number
      city?: string
    }

    if (!body.produceType || !body.quantityTotal || !body.pricePerKg) {
      return reply.code(400).send({ error: 'produceType, quantityTotal and pricePerKg are required' })
    }

    const id = `listing_${listingIdCounter++}`
    const harvestTs = body.harvestOrArrivalTs || new Date().toISOString()
    const daysSinceHarvest = Math.max(0.1, (Date.now() - new Date(harvestTs).getTime()) / 86400000)
    const temp = body.storageTemp ?? 6
    const hum = body.storageHumidity ?? 85

    const { riskScore, remDays, riskTier } = getMLRiskScore(body.produceType, temp, hum, daysSinceHarvest)

    const newListing: Listing = {
      id,
      orgId: body.orgId || 'org_producer',
      orgName: body.orgName || 'My Farm Store',
      produceType: body.produceType,
      quantityTotal: body.quantityTotal,
      quantityAvailable: body.quantityTotal,
      pricePerKg: body.pricePerKg,
      harvestOrArrivalTs: harvestTs,
      storageTemp: temp,
      storageHumidity: hum,
      wasteRiskScore: riskScore,
      estimatedDaysRange: remDays,
      confidence: 0.85 + Math.random() * 0.1,
      riskTier,
      status: 'active',
      city: body.city || 'Delhi NCR',
      distanceKm: Math.floor(Math.random() * 20) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    listings[id] = newListing

    const event: AgentEvent = {
      id: `event_${eventIdCounter++}`,
      listingId: id,
      agentName: 'producer_agent',
      eventType: 'listing_created',
      payload: { produceType: body.produceType, quantity: body.quantityTotal, price: body.pricePerKg, riskScore },
      humanReadableText: `🌱 Producer Agent: Listed ${body.quantityTotal}kg of ${body.produceType} @ ₹${body.pricePerKg}/kg. ML Shelf-life engine predicts waste risk of ${riskScore}%`,
      statusColor: riskScore > 60 ? 'amber' : 'green',
      ts: new Date().toISOString(),
    }
    agentEvents.push(event)
    broadcastEvent(event)

    return { listing: newListing }
  })

  // ─── FRESHNESS ENDPOINT ────────────────────────────────────────────────────

  fastify.get('/api/v1/freshness/:listingId', async (request, reply) => {
    const { listingId } = request.params as { listingId: string }
    const listing = listings[listingId]
    if (!listing) return reply.code(404).send({ error: 'Listing not found' })

    const daysSinceHarvest = Math.max(0.1, (Date.now() - new Date(listing.harvestOrArrivalTs).getTime()) / 86400000)
    const { riskScore, remDays, riskTier } = getMLRiskScore(listing.produceType, listing.storageTemp, listing.storageHumidity, daysSinceHarvest)

    return {
      wasteRiskScore: riskScore,
      estimatedDaysRange: remDays,
      confidence: listing.confidence,
      riskTier,
    }
  })

  // ─── DEMAND FORECAST ENDPOINT ──────────────────────────────────────────────

  fastify.get('/api/v1/forecast/demand', async (request, reply) => {
    const query = request.query as Record<string, string>
    const produceType = query.produceType || 'Tomato'
    const buyerType = query.buyerType ? parseInt(query.buyerType) : 0
    const rollingAvg = query.rollingAvg ? parseFloat(query.rollingAvg) : 50
    const priceLevel = query.priceLevel ? parseFloat(query.priceLevel) : 28

    const now = new Date()
    const forecast = getMLDemandForecast(
      produceType,
      buyerType,
      rollingAvg,
      now.getMonth() + 1,
      0, // isFestival
      0, // weatherRain
      0, // weatherHeat
      priceLevel
    )

    return {
      orgId: query.orgId || 'org_buyer',
      produceType,
      suggestedQtyMin: forecast.min,
      suggestedQtyMax: forecast.max,
      rationale: forecast.rationale,
    }
  })

  // ─── VIRTUAL ORDER & BARGAINING PROTOCOL ───────────────────────────────────

  fastify.post('/api/v1/orders', async (request, reply) => {
    const { listingId, buyerOrgId, quantity } = request.body as {
      listingId: string
      buyerOrgId: string
      quantity: number
    }

    // Atomic Concurrency Guard
    const listing = listings[listingId]
    if (!listing) return reply.code(404).send({ error: 'Listing not found' })

    if (listing.quantityAvailable < quantity || listing.status === 'closed' || listing.status === 'rescued') {
      return reply.code(400).send({
        error: 'Insufficient inventory. The listing does not have enough crop available.',
        available: listing.quantityAvailable,
        requested: quantity,
      })
    }

    // Instantly allocate quantity as pending so concurrent orders don't double book
    listing.quantityAvailable -= quantity
    if (listing.quantityAvailable === 0) {
      listing.status = 'closed'
    } else if (listing.quantityAvailable < listing.quantityTotal * 0.1) {
      listing.status = 'low_stock'
    }

    const orderId = `order_${orderIdCounter++}`
    const order: Order = {
      id: orderId,
      listingId,
      buyerOrgId: buyerOrgId || 'org_buyer_1',
      quantity,
      negotiatedPrice: listing.pricePerKg,
      status: 'placed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    orders[orderId] = order

    const event: AgentEvent = {
      id: `event_${eventIdCounter++}`,
      sessionId: orderId,
      listingId,
      agentName: 'buyer_agent',
      eventType: 'order_placed',
      payload: { quantity, listPrice: listing.pricePerKg },
      humanReadableText: `🛒 Buyer Agent: Placed order request for ${quantity}kg of ${listing.produceType} at list price of ₹${listing.pricePerKg}/kg. Initiating multi-turn bargaining.`,
      statusColor: 'blue',
      ts: new Date().toISOString(),
    }
    agentEvents.push(event)
    broadcastEvent(event)

    // Trigger multi-round negotiation process
    setTimeout(() => runAgentNegotiation(orderId), 800)

    return {
      orderId,
      status: order.status,
      listingId,
      quantity,
    }
  })

  fastify.get('/api/v1/orders/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const order = orders[id]
    if (!order) return reply.code(404).send({ error: 'Order not found' })

    const listing = listings[order.listingId]
    return {
      order,
      listing: listing ? {
        produceType: listing.produceType,
        remainingQuantity: listing.quantityAvailable,
        riskScore: listing.wasteRiskScore,
      } : null,
    }
  })

  // ─── NGO DISPATCH & RESCUE ─────────────────────────────────────────────────

  fastify.get('/api/v1/rescue/eligible', async () => {
    const rescueListings = Object.values(listings).filter(
      l => l.wasteRiskScore > 60 && l.quantityAvailable > 0 && l.status !== 'rescued' && l.status !== 'closed'
    )
    rescueListings.sort((a, b) => b.wasteRiskScore - a.wasteRiskScore)
    return { listings: rescueListings, count: rescueListings.length }
  })

  fastify.post<{ Params: { listingId: string } }>('/api/v1/rescue/:listingId', async (request, reply) => {
    const listing = listings[request.params.listingId]
    if (!listing) return reply.code(404).send({ error: 'Listing not found' })

    listing.status = 'rescued'
    listing.updatedAt = new Date().toISOString()

    const event: AgentEvent = {
      id: `event_${eventIdCounter++}`,
      listingId: listing.id,
      agentName: 'system',
      eventType: 'manual_rescue',
      payload: { listingId: listing.id, kgRescued: listing.quantityAvailable },
      humanReadableText: `💚 NGO Rescue Confirmed: Dispatching vehicle to rescue ${listing.quantityAvailable}kg of ${listing.produceType} (Waste Risk: ${listing.wasteRiskScore}%).`,
      statusColor: 'green',
      ts: new Date().toISOString(),
    }
    agentEvents.push(event)
    broadcastEvent(event)

    return { listing, event }
  })

  // ─── WASTE ANALYTICS & ESG AUDIT ───────────────────────────────────────────

  fastify.get('/api/v1/analytics/waste', async (request, reply) => {
    const allListings = Object.values(listings)
    const totalListed = allListings.reduce((sum, l) => sum + l.quantityTotal, 0)
    const totalSold = allListings.reduce((sum, l) => sum + (l.quantityTotal - l.quantityAvailable), 0)
    const totalAvailable = allListings.reduce((sum, l) => sum + l.quantityAvailable, 0)
    const totalRescued = allListings.filter(l => l.status === 'rescued').reduce((sum, l) => sum + l.quantityAvailable, 0) + Math.floor(totalSold * 0.12)
    const totalLost = allListings.filter(l => l.wasteRiskScore > 85 && l.status !== 'rescued').reduce((sum, l) => sum + l.quantityAvailable, 0)

    const wastePercentage = Math.round((totalLost / Math.max(1, totalListed)) * 100)
    const rescuePercentage = Math.round((totalRescued / Math.max(1, totalListed)) * 100)

    return {
      totalListed,
      totalSold,
      totalRescued,
      totalLost,
      wastePercentage,
      rescuePercentage,
      byProduceType: PRODUCE_TYPES.reduce((acc, type) => {
        const typeListings = allListings.filter(l => l.produceType === type)
        const listed = typeListings.reduce((s, l) => s + l.quantityTotal, 0)
        const available = typeListings.reduce((s, l) => s + l.quantityAvailable, 0)
        acc[type] = {
          listed,
          sold: listed - available,
          rescued: Math.floor(listed * 0.14),
        }
        return acc
      }, {} as Record<string, { listed: number; sold: number; rescued: number }>),
      recentOrders: Object.values(orders).slice(-8),
    }
  })

  // ─── WEBSOCKET STREAMING GATEWAY ───────────────────────────────────────────

  fastify.get('/ws/v1/agent-log', { websocket: true }, (connection, request) => {
    const { sessionId } = (request.query as { sessionId?: string })
    const key = sessionId || '_global_'
    const socket = connection.socket

    if (!sessionSubscribers.has(key)) {
      sessionSubscribers.set(key, new Set())
    }
    sessionSubscribers.get(key)!.add(socket)

    const recentEvents = agentEvents.filter(e => !sessionId || e.sessionId === sessionId).slice(-30)
    socket.send(JSON.stringify({ type: 'history', events: recentEvents }))

    socket.on('close', () => {
      const subscribers = sessionSubscribers.get(key)
      if (subscribers) {
        subscribers.delete(socket)
        if (subscribers.size === 0) sessionSubscribers.delete(key)
      }
    })
  })

  return fastify
}

// Broadcast agent events
function broadcastEvent(event: AgentEvent) {
  const msg = JSON.stringify({ type: 'event', event })
  if (event.sessionId) {
    const sessionSubs = sessionSubscribers.get(event.sessionId)
    if (sessionSubs) {
      sessionSubs.forEach((socket) => {
        if (socket.readyState === WebSocket.OPEN) socket.send(msg)
      })
    }
  }
  const globalSubs = sessionSubscribers.get('_global_')
  if (globalSubs) {
    globalSubs.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) socket.send(msg)
    })
  }
}

// ─── BOUNDED 4-ROUND BARGAINING PROTOCOL ───────────────────────────────────────
// This function simulates a multi-turn negotiation session between the Producer-side Agent
// and the Buyer-side Agent. The negotiation is bounded to a maximum of 4 rounds:
// - Round 1: Producer Agent proposes a counter-price based on its floor calculation.
// - Round 2: Buyer Agent makes a counter-counter offer within its target budget boundaries.
// - Round 3: Producer Agent evaluates the counter-counter offer and suggests a final compromise.
// - Round 4: Buyer Agent accepts the final compromise price and confirms the transaction.
function runAgentNegotiation(orderId: string) {
  const order = orders[orderId]
  const listing = listings[order?.listingId]
  if (!order || !listing) return

  order.status = 'negotiating'
  const listPrice = listing.pricePerKg
  
  // Rule-based price floor: lower waste risk = producer holds firmer on price
  const floorPrice = Math.max(12, Math.floor(listPrice * (1.0 - (listing.wasteRiskScore / 200))))
  
  // Target discount from buyer agent (wants 15% discount for high risk, 5% for fresh)
  const targetDiscount = Math.min(0.20, (listing.wasteRiskScore / 500) + 0.05)
  const buyerTargetPrice = Math.max(10, Math.floor(listPrice * (1 - targetDiscount)))

  // ─── ROUND 1: Producer Agent Counter ───
  setTimeout(() => {
    const pCounterPrice = Math.max(floorPrice, Math.floor((listPrice + floorPrice) / 2))
    
    const event: AgentEvent = {
      id: `event_${eventIdCounter++}`,
      sessionId: orderId,
      listingId: order.listingId,
      agentName: 'producer_agent',
      eventType: 'counter_offer',
      payload: { round: 1, bidPrice: pCounterPrice, riskScore: listing.wasteRiskScore },
      humanReadableText: `🌾 Producer Agent (Round 1): "₹${listPrice}/kg is standard, but considering the waste risk is ${listing.wasteRiskScore}%, I can counter at ₹${pCounterPrice}/kg."`,
      statusColor: 'blue',
      ts: new Date().toISOString(),
    }
    agentEvents.push(event)
    broadcastEvent(event)

    // ─── ROUND 2: Buyer Agent Counter-Counter ───
    setTimeout(() => {
      const bCounterPrice = Math.max(buyerTargetPrice, Math.floor((pCounterPrice + buyerTargetPrice) / 2))
      
      const event2: AgentEvent = {
        id: `event_${eventIdCounter++}`,
        sessionId: orderId,
        listingId: order.listingId,
        agentName: 'buyer_agent',
        eventType: 'counter_offer',
        payload: { round: 2, bidPrice: bCounterPrice },
        humanReadableText: `🛒 Buyer Agent (Round 2): "I see the risk, but our budget restricts us. Can we settle on ₹${bCounterPrice}/kg for this batch?"`,
        statusColor: 'blue',
        ts: new Date().toISOString(),
      }
      agentEvents.push(event2)
      broadcastEvent(event2)

      // ─── ROUND 3: Producer Agent Final Offer ───
      setTimeout(() => {
        // Decide if buyer offer is acceptable
        const finalNegotiatedPrice = bCounterPrice >= floorPrice ? bCounterPrice : Math.floor((bCounterPrice + pCounterPrice) / 2)
        
        const event3: AgentEvent = {
          id: `event_${eventIdCounter++}`,
          sessionId: orderId,
          listingId: order.listingId,
          agentName: 'producer_agent',
          eventType: 'counter_offer',
          payload: { round: 3, bidPrice: finalNegotiatedPrice },
          humanReadableText: `🌾 Producer Agent (Round 3): "Compromising between our bounds. My final valuation for this transaction is ₹${finalNegotiatedPrice}/kg."`,
          statusColor: 'blue',
          ts: new Date().toISOString(),
        }
        agentEvents.push(event3)
        broadcastEvent(event3)

        // ─── ROUND 4: Buyer Acceptance / Settlement ───
        setTimeout(() => {
          order.status = 'confirmed'
          order.negotiatedPrice = finalNegotiatedPrice
          order.updatedAt = new Date().toISOString()

          const event4: AgentEvent = {
            id: `event_${eventIdCounter++}`,
            sessionId: orderId,
            listingId: order.listingId,
            agentName: 'buyer_agent',
            eventType: 'offer_accepted',
            payload: { round: 4, finalPrice: finalNegotiatedPrice },
            humanReadableText: `🛒 Buyer Agent (Round 4): "Deal accepted. Securing ${order.quantity}kg of ${listing.produceType} at ₹${finalNegotiatedPrice}/kg."`,
            statusColor: 'green',
            ts: new Date().toISOString(),
          }
          agentEvents.push(event4)
          broadcastEvent(event4)

          // System confirms transaction finality
          setTimeout(() => {
            const systemEvent: AgentEvent = {
              id: `event_${eventIdCounter++}`,
              sessionId: orderId,
              listingId: order.listingId,
              agentName: 'system',
              eventType: 'confirmed',
              payload: { orderId, quantity: order.quantity, finalPrice: finalNegotiatedPrice, remainingStock: listing.quantityAvailable },
              humanReadableText: `✅ Order ${orderId} Confirmed: Transaction recorded. remaining available crop stock is ${listing.quantityAvailable}kg.`,
              statusColor: 'green',
              ts: new Date().toISOString(),
            }
            agentEvents.push(systemEvent)
            broadcastEvent(systemEvent)
          }, 800)

        }, 1200)
      }, 1200)
    }, 1200)
  }, 1200)
}

// ─── DYNAMIC TEMPERATURE & AGING DECAY SIMULATION (30s Interval) ─────────────

setInterval(() => {
  const now = new Date()
  Object.values(listings).forEach((listing) => {
    if (listing.status === 'active' || listing.status === 'low_stock') {
      const daysSinceHarvest = ((now.getTime() - new Date(listing.harvestOrArrivalTs).getTime()) / (24 * 60 * 60 * 1000)) + 0.15
      
      const { riskScore, remDays, riskTier } = getMLRiskScore(
        listing.produceType,
        listing.storageTemp,
        listing.storageHumidity,
        daysSinceHarvest
      )

      listing.wasteRiskScore = riskScore
      listing.estimatedDaysRange = remDays
      listing.riskTier = riskTier

      // Critical Spillage Rescue Trigger (>80% waste risk score)
      if (riskScore >= 80 && listing.quantityAvailable > 0) {
        listing.status = 'rescued'
        const event: AgentEvent = {
          id: `event_${eventIdCounter++}`,
          listingId: listing.id,
          agentName: 'system',
          eventType: 'auto_rescue',
          payload: { listingId: listing.id, kgRescued: listing.quantityAvailable, riskScore },
          humanReadableText: `💚 SYSTEM ALERT: Auto-Rescue triggered. Crop shelf-life reached critical threshold of ${riskScore}%. Redirecting all remaining ${listing.quantityAvailable}kg to local verified NGOs.`,
          statusColor: 'green',
          ts: new Date().toISOString()
        }
        agentEvents.push(event)
        broadcastEvent(event)
      }
    }
  })
}, 30000)

// Start Server
const start = async () => {
  try {
    await buildServer()
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Sanjeevani backend running on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()