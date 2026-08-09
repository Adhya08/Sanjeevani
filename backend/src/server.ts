import Fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyRateLimit from '@fastify/rate-limit'
import { WebSocket } from 'ws'

// Mock data store - in production would use PostgreSQL/Redis
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
  statusColor: 'amber' | 'blue' | 'green' | 'red'  // amber=searching, blue=negotiating, green=success, red=blocked
  ts: string
}

// In-memory stores for demo
const listings: Record<string, Listing> = {}
const orders: Record<string, Order> = {}
const agentEvents: AgentEvent[] = []
const sessionSubscribers: Map<string, Set<WebSocket>> = new Map()

// Mock seed data
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
const ORG_NAMES = ['Ramesh Farms', 'Bhanu Agri', 'Gopal Traders', 'Sunita Produce', 'Ravi Harvest']

// Generate mock listings
const PRODUCE_TYPES = ['Tomato', 'Potato', 'Onion', 'Cabbage', 'Cauliflower', 'Carrot', 'Banana', 'Mango'] as const

function createMockListings() {
  const orgIds = ['org_1', 'org_2', 'org_3', 'org_4', 'org_5']

  PRODUCE_TYPES.forEach((produce, i) => {
    for (let j = 0; j < 3; j++) {
      const id = `listing_${listingIdCounter++}`
      const orgId = orgIds[i % orgIds.length]
      const quantity = Math.floor(Math.random() * 500) + 50
      const price = Math.floor(Math.random() * 20) + 18
      // Mix of risks: some fresh, some moderate, some high (for NGO view)
      const riskScore = j === 2 ? Math.floor(Math.random() * 30) + 65 : Math.floor(Math.random() * 55)
      const daysHarvested = Math.floor(Math.random() * 5) + 1

      listings[id] = {
        id,
        orgId,
        orgName: ORG_NAMES[i % ORG_NAMES.length],
        produceType: produce,
        quantityTotal: quantity,
        quantityAvailable: quantity,
        pricePerKg: price,
        harvestOrArrivalTs: new Date(Date.now() - daysHarvested * 24 * 60 * 60 * 1000).toISOString(),
        storageTemp: 2 + Math.floor(Math.random() * 8),
        storageHumidity: 80 + Math.floor(Math.random() * 15),
        wasteRiskScore: riskScore,
        estimatedDaysRange: [Math.max(1, 7 - daysHarvested), Math.max(2, 10 - daysHarvested)] as [number, number],
        confidence: 0.78 + Math.random() * 0.2,
        riskTier: getRiskTier(riskScore),
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

// Fastify server
const fastify = Fastify({
  logger: true,
})

// Register plugins
async function buildServer() {
  await fastify.register(fastifyCors, {
    origin: true,
    credentials: true,
  })

  await fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'sanjeevani-demo-secret-key',
    sign: { expiresIn: '1h' },
  })

  await fastify.register(fastifyWebsocket)

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  // API Routes

  // GET /api/v1/listings - Browse listings (Buyer Dashboard)
  fastify.get('/api/v1/listings', async (request, reply) => {
    const { produceType, maxPrice, maxDistanceKm, riskTier, lat, lng } = request.query as Record<string, string>

    let results = Object.values(listings).filter(l => l.status === 'active')

    if (produceType) {
      results = results.filter(l => l.produceType === produceType)
    }
    if (maxPrice) {
      const price = parseFloat(maxPrice)
      results = results.filter(l => l.pricePerKg <= price)
    }
    if (riskTier) {
      results = results.filter(l => l.riskTier === riskTier)
    }

    // Sort by risk score ascending (freshest first)
    results.sort((a, b) => a.wasteRiskScore - b.wasteRiskScore)

    return {
      listings: results,
      count: results.length,
    }
  })

  // GET /api/v1/listings/:id - Get single listing
  fastify.get('/api/v1/listings/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const listing = listings[id]

    if (!listing) {
      return reply.code(404).send({ error: 'Listing not found' })
    }

    return { listing }
  })

  // GET /api/v1/freshness/:listingId - Get waste risk score
  fastify.get('/api/v1/freshness/:listingId', async (request, reply) => {
    const { listingId } = request.params as { listingId: string }
    const listing = listings[listingId]

    if (!listing) {
      return reply.code(404).send({ error: 'Listing not found' })
    }

    return {
      wasteRiskScore: listing.wasteRiskScore,
      estimatedDaysRange: [1, 7],
      confidence: listing.confidence,
      riskTier: listing.riskTier,
    }
  })

  // GET /api/v1/forecast/demand - Get demand prediction
  fastify.get('/api/v1/forecast/demand', async (request, reply) => {
    const { orgId, produceType } = request.query as Record<string, string>

    // Mock prediction based on historical patterns
    const basePredictions: Record<string, { min: number; max: number; rationale: string }> = {
      'Tomato': { min: 35, max: 45, rationale: 'Last 4 weeks avg: 40kg, monsoon typically +5%' },
      'Potato': { min: 50, max: 70, rationale: 'Steady weekly demand, 25kg avg' },
      'Onion': { min: 40, max: 60, rationale: 'Weekly variation, avg 50kg' },
      'Banana': { min: 25, max: 35, rationale: 'Daily consumption, avoid over-purchasing' },
      'Mango': { min: 15, max: 25, rationale: 'Seasonal peak, limited availability' },
    }

    const prediction = basePredictions[produceType || 'Tomato'] || basePredictions['Tomato']

    return {
      orgId,
      produceType,
      suggestedQtyMin: prediction.min,
      suggestedQtyMax: prediction.max,
      rationale: prediction.rationale,
    }
  })

  // POST /api/v1/orders - Place virtual order
  fastify.post('/api/v1/orders', async (request, reply) => {
    const { listingId, buyerOrgId, quantity } = request.body as {
      listingId: string
      buyerOrgId: string
      quantity: number
    }

    const listing = listings[listingId]

    if (!listing) {
      return reply.code(404).send({ error: 'Listing not found' })
    }

    // Check available quantity
    if (listing.quantityAvailable < quantity) {
      return reply.code(400).send({
        error: 'Insufficient inventory',
        available: listing.quantityAvailable,
        requested: quantity,
      })
    }

    // Create order
    const orderId = `order_${orderIdCounter++}`
    const order: Order = {
      id: orderId,
      listingId,
      buyerOrgId,
      quantity,
      negotiatedPrice: listing.pricePerKg,
      status: 'placed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    orders[orderId] = order

    // Add initial agent event
    const event: AgentEvent = {
      id: `event_${eventIdCounter++}`,
      sessionId: orderId,
      listingId,
      agentName: 'buyer_agent',
      eventType: 'order_placed',
      payload: { quantity, price: listing.pricePerKg },
      humanReadableText: `🛒 Buyer Agent placed order for ${quantity}kg ${listing.produceType} at ₹${listing.pricePerKg}/kg`,
      statusColor: 'blue',
      ts: new Date().toISOString(),
    }
    agentEvents.push(event)
    broadcastEvent(event)

    // Simulate negotiation process
    setTimeout(() => simulateNegotiation(orderId), 1000)

    return {
      orderId,
      status: order.status,
      listingId,
      quantity,
    }
  })

  // GET /api/v1/orders/:id - Get order status
  fastify.get('/api/v1/orders/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const order = orders[id]

    if (!order) {
      return reply.code(404).send({ error: 'Order not found' })
    }

    const listing = listings[order.listingId]

    return {
      order,
      listing: listing ? {
        produceType: listing.produceType,
        remainingQuantity: listing.quantityAvailable,
      } : null,
    }
  })

  // GET /api/v1/analytics/waste - Waste analytics
  fastify.get('/api/v1/analytics/waste', async (request, reply) => {
    const { orgId, period } = request.query as Record<string, string>

    const allListings = Object.values(listings)
    const totalListed = allListings.reduce((sum, l) => sum + l.quantityTotal, 0)
    const totalSold = allListings.reduce((sum, l) => sum + (l.quantityTotal - l.quantityAvailable), 0)
    const totalAvailable = allListings.reduce((sum, l) => sum + l.quantityAvailable, 0)

    return {
      totalListed,
      totalSold,
      totalRescued: Math.floor(totalAvailable * 0.15), // Mock 15% rescue rate
      totalLost: Math.floor(totalAvailable * 0.05), // Mock 5% loss
      wastePercentage: 5,
      rescuePercentage: 15,
      byProduceType: PRODUCE_TYPES.reduce((acc, type) => {
        const typeListings = allListings.filter(l => l.produceType === type)
        acc[type] = {
          listed: typeListings.reduce((s, l) => s + l.quantityTotal, 0),
          sold: typeListings.reduce((s, l) => s + (l.quantityTotal - l.quantityAvailable), 0),
          rescued: Math.floor(typeListings.reduce((s, l) => s + l.quantityAvailable, 0) * 0.15),
        }
        return acc
      }, {} as Record<string, { listed: number; sold: number; rescued: number }>),
    }
  })

  // WebSocket connection handler - session_id optional; '_global_' key used without it
  fastify.get('/ws/v1/agent-log', { websocket: true }, (socket, request) => {
    const { sessionId } = (request.query as { sessionId?: string })
    const key = sessionId || '_global_'

    // Add socket to subscribers
    if (!sessionSubscribers.has(key)) {
      sessionSubscribers.set(key, new Set())
    }
    sessionSubscribers.get(key)!.add(socket)

    // Send recent history on connect
    const recentEvents = agentEvents.slice(-20)
    socket.send(JSON.stringify({ type: 'history', events: recentEvents }))

    socket.on('close', () => {
      const subscribers = sessionSubscribers.get(key)
      if (subscribers) {
        subscribers.delete(socket)
        if (subscribers.size === 0) {
          sessionSubscribers.delete(key)
        }
      }
    })
  })

  // POST /api/v1/listings - Create new listing
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
    const daysSinceHarvest = Math.floor((Date.now() - new Date(harvestTs).getTime()) / 86400000)
    const tempFactor = ((body.storageTemp ?? 5) / 30) * 20
    const dayFactor = Math.min(daysSinceHarvest * 8, 50)
    const produceFactor = ['Tomato', 'Banana', 'Mango'].includes(body.produceType) ? 10 : 0
    const riskScore = Math.min(100, Math.floor(tempFactor + dayFactor + produceFactor + Math.random() * 5))

    const newListing: Listing = {
      id,
      orgId: body.orgId || 'org_producer',
      orgName: body.orgName || 'My Farm',
      produceType: body.produceType,
      quantityTotal: body.quantityTotal,
      quantityAvailable: body.quantityTotal,
      pricePerKg: body.pricePerKg,
      harvestOrArrivalTs: harvestTs,
      storageTemp: body.storageTemp ?? 4,
      storageHumidity: body.storageHumidity ?? 85,
      wasteRiskScore: riskScore,
      estimatedDaysRange: [Math.max(1, 7 - daysSinceHarvest), Math.max(2, 10 - daysSinceHarvest)] as [number, number],
      confidence: 0.78 + Math.random() * 0.2,
      riskTier: getRiskTier(riskScore),
      status: 'active',
      city: body.city || 'Delhi',
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
      humanReadableText: `🌱 New listing created: ${body.quantityTotal}kg ${body.produceType} @ ₹${body.pricePerKg}/kg. Waste risk: ${riskScore}%`,
      statusColor: riskScore > 60 ? 'amber' : 'green',
      ts: new Date().toISOString(),
    }
    agentEvents.push(event)
    broadcastEvent(event)

    return { listing: newListing }
  })

  // GET /api/v1/rescue/eligible - NGO high-risk stock
  fastify.get('/api/v1/rescue/eligible', async () => {
    const rescueListings = Object.values(listings).filter(
      l => l.wasteRiskScore > 65 && l.quantityAvailable > 0 && l.status !== 'rescued'
    )
    rescueListings.sort((a, b) => b.wasteRiskScore - a.wasteRiskScore)
    return { listings: rescueListings, count: rescueListings.length }
  })

  // POST /api/v1/rescue/:listingId - NGO claims rescue
  fastify.post<{ Params: { listingId: string } }>('/api/v1/rescue/:listingId', async (request, reply) => {
    const listing = listings[request.params.listingId]
    if (!listing) return reply.code(404).send({ error: 'Listing not found' })
    listing.status = 'rescued'
    listing.updatedAt = new Date().toISOString()
    const event: AgentEvent = {
      id: `event_${eventIdCounter++}`,
      listingId: listing.id,
      agentName: 'system',
      eventType: 'auto_rescue',
      payload: { listingId: listing.id, kgRescued: listing.quantityAvailable },
      humanReadableText: `💚 NGO rescue: ${listing.quantityAvailable}kg ${listing.produceType} saved (risk ${listing.wasteRiskScore}%)`,
      statusColor: 'green',
      ts: new Date().toISOString(),
    }
    agentEvents.push(event)
    broadcastEvent(event)
    return { listing, event }
  })

  return fastify
}

// Broadcast event to session + global WebSocket subscribers
function broadcastEvent(event: AgentEvent) {
  const msg = JSON.stringify({ type: 'event', event })
  // Broadcast to session-specific subscribers
  if (event.sessionId) {
    const sessionSubs = sessionSubscribers.get(event.sessionId)
    if (sessionSubs) {
      sessionSubs.forEach((socket) => {
        if (socket.readyState === WebSocket.OPEN) socket.send(msg)
      })
    }
  }
  // Broadcast to global subscribers
  const globalSubs = sessionSubscribers.get('_global_')
  if (globalSubs) {
    globalSubs.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) socket.send(msg)
    })
  }
}

// Simulate negotiation process (bounded 2 rounds)
function simulateNegotiation(orderId: string) {
  const order = orders[orderId]
  const listing = listings[order?.listingId]
  if (!order || !listing) return

  order.status = 'negotiating'
  const originalPrice = order.negotiatedPrice
  const counterPrice = Math.max(originalPrice - 2, Math.floor(originalPrice * 0.94))

  // Round 1: producer counter
  const round1: AgentEvent = {
    id: `event_${eventIdCounter++}`,
    sessionId: orderId,
    listingId: order.listingId,
    agentName: 'producer_agent',
    eventType: 'counter_offer',
    payload: { newPrice: counterPrice, riskScore: listing.wasteRiskScore },
    humanReadableText: `🌱 Producer Agent: "₹${originalPrice}/kg? My floor is ₹${counterPrice}/kg given ${listing.wasteRiskScore}% waste risk."`,
    statusColor: 'blue',
    ts: new Date().toISOString(),
  }
  agentEvents.push(round1)
  broadcastEvent(round1)

  // Round 2: buyer accepts
  setTimeout(() => {
    const round2: AgentEvent = {
      id: `event_${eventIdCounter++}`,
      sessionId: orderId,
      listingId: order.listingId,
      agentName: 'buyer_agent',
      eventType: 'offer_accepted',
      payload: { acceptedPrice: counterPrice, quantity: order.quantity },
      humanReadableText: `🛒 Buyer Agent accepted ₹${counterPrice}/kg for ${order.quantity}kg. Finalizing...`,
      statusColor: 'blue',
      ts: new Date().toISOString(),
    }
    agentEvents.push(round2)
    broadcastEvent(round2)

    // Confirm
    setTimeout(() => {
      order.status = 'confirmed'
      order.negotiatedPrice = counterPrice
      order.updatedAt = new Date().toISOString()
      if (listing.quantityAvailable === 0) listing.status = 'closed'

      const confirmEvent: AgentEvent = {
        id: `event_${eventIdCounter++}`,
        sessionId: orderId,
        listingId: order.listingId,
        agentName: 'system',
        eventType: 'confirmed',
        payload: { orderId, quantity: order.quantity, finalPrice: counterPrice, remainingStock: listing.quantityAvailable },
        humanReadableText: `✅ Order ${orderId} CONFIRMED! ${order.quantity}kg ${listing.produceType} @ ₹${counterPrice}/kg. Remaining: ${listing.quantityAvailable}kg`,
        statusColor: 'green',
        ts: new Date().toISOString(),
      }
      agentEvents.push(confirmEvent)
      broadcastEvent(confirmEvent)
    }, 1500)
  }, 2000)
}

// Start server
const start = async () => {
  try {
    await buildServer()
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Sanjeevani server listening on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()