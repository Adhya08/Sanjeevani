// Sanjeevani API Service Layer
// Centralised HTTP + WebSocket client

const BASE_URL = '/api/v1'
const WS_URL = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`

// ─── Types (mirrored from backend) ────────────────────────────────────────────

export interface Listing {
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

export interface Order {
  id: string
  listingId: string
  buyerOrgId: string
  quantity: number
  negotiatedPrice: number
  status: 'placed' | 'negotiating' | 'confirmed' | 'fulfilled' | 'rejected' | 'expired'
  createdAt: string
  updatedAt: string
}

export interface AgentEvent {
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

export interface DemandForecast {
  orgId?: string
  produceType: string
  min: number
  max: number
  rationale: string
}

export interface WasteAnalytics {
  totalListed: number
  totalSold: number
  totalRescued: number
  totalLost: number
  wastePercentage: number
  rescuePercentage: number
  byProduceType: Record<string, { listed: number; sold: number; rescued: number }>
  recentOrders: Order[]
}

// ─── HTTP helpers ──────────────────────────────────────────────────────────────

async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(BASE_URL + path, location.href)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    })
  }
  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(BASE_URL + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── API methods ──────────────────────────────────────────────────────────────

export const api = {
  // Listings
  getListings: (filters?: { produceType?: string; maxPrice?: number; riskTier?: string; orgId?: string }) =>
    get<{ listings: Listing[]; count: number }>('/listings', filters as Record<string, string>),

  getListing: (id: string) =>
    get<{ listing: Listing }>(`/listings/${id}`),

  createListing: (data: {
    orgId?: string
    orgName?: string
    produceType: string
    quantityTotal: number
    pricePerKg: number
    harvestOrArrivalTs?: string
    storageTemp?: number
    storageHumidity?: number
    city?: string
  }) => post<{ listing: Listing }>('/listings', data),

  // Freshness
  getFreshness: (listingId: string) =>
    get<{ wasteRiskScore: number; estimatedDaysRange: [number, number]; confidence: number; riskTier: string }>(`/freshness/${listingId}`),

  // Demand forecast
  getDemandForecast: (produceType: string, orgId?: string) =>
    get<DemandForecast>('/forecast/demand', { produceType, ...(orgId ? { orgId } : {}) }),

  // Orders
  placeOrder: (data: { listingId: string; buyerOrgId?: string; quantity: number }) =>
    post<{ orderId: string; status: string; listingId: string; quantity: number }>('/orders', data),

  getOrder: (orderId: string) =>
    get<{ order: Order; listing: { produceType: string; remainingQuantity: number; riskScore: number } | null }>(`/orders/${orderId}`),

  // NGO
  getRescueEligible: () =>
    get<{ listings: Listing[]; count: number }>('/rescue/eligible'),

  claimRescue: (listingId: string) =>
    post<{ listing: Listing; event: AgentEvent }>(`/rescue/${listingId}`, {}),

  // Analytics
  getWasteAnalytics: (orgId?: string) =>
    get<WasteAnalytics>('/analytics/waste', orgId ? { orgId } : undefined),

  // Auth (mock)
  requestOtp: (phone: string) =>
    post<{ message: string; phone: string }>('/auth/request-otp', { phone }),

  verifyOtp: (phone: string, otp: string, role: string) =>
    post<{ token: string; role: string; userId: string }>('/auth/verify-otp', { phone, otp, role }),
}

// ─── WebSocket helper ──────────────────────────────────────────────────────────

export type WsMessage =
  | { type: 'history'; events: AgentEvent[] }
  | { type: 'event'; event: AgentEvent }

export function connectAgentLog(
  onEvent: (event: AgentEvent) => void,
  onHistory: (events: AgentEvent[]) => void,
  sessionId?: string,
): () => void {
  const url = `${WS_URL}/ws/v1/agent-log${sessionId ? `?sessionId=${sessionId}` : ''}`
  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let closed = false

  const connect = () => {
    if (closed) return
    try {
      ws = new WebSocket(url)

      ws.onmessage = (e) => {
        try {
          const msg: WsMessage = JSON.parse(e.data)
          if (msg.type === 'history') onHistory(msg.events)
          else if (msg.type === 'event') onEvent(msg.event)
        } catch (_) {/* ignore parse errors */}
      }

      ws.onclose = () => {
        if (!closed) {
          // Reconnect after 3s
          reconnectTimer = setTimeout(connect, 3000)
        }
      }

      ws.onerror = () => {
        ws?.close()
      }
    } catch (_) {
      // WS not available (e.g. SSR), ignore
    }
  }

  connect()

  // Return cleanup function
  return () => {
    closed = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    ws?.close()
  }
}
