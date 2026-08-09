import React, { useState, useEffect, useRef } from 'react'
import { connectAgentLog, AgentEvent } from '../../services/api'

interface ActivityLogProps {
  sessionId?: string
}

const STATUS_COLORS: Record<string, { dot: string; bg: string; border: string }> = {
  amber:  { dot: 'bg-amber-500',  bg: 'bg-amber-50',  border: 'border-amber-400' },
  blue:   { dot: 'bg-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-400' },
  green:  { dot: 'bg-green-500',  bg: 'bg-green-50',  border: 'border-green-400' },
  red:    { dot: 'bg-red-500',    bg: 'bg-red-50',    border: 'border-red-400' },
}

const AGENT_ICONS: Record<string, string> = {
  producer_agent: '🌱',
  buyer_agent: '🛒',
  system: '⚙️',
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ sessionId }) => {
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const eventsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const disconnect = connectAgentLog(
      (event) => {
        setConnected(true)
        setEvents((prev) => [...prev.slice(-49), event]) // keep last 50
      },
      (history) => {
        setConnected(true)
        setEvents(history)
      },
      sessionId,
    )

    // If WS doesn't connect in 2s, inject mock events so UI isn't empty
    const fallbackTimer = setTimeout(() => {
      setEvents((prev) => {
        if (prev.length > 0) return prev
        return [
          {
            id: 'mock-1',
            sessionId,
            agentName: 'producer_agent',
            eventType: 'search_start',
            payload: {},
            humanReadableText: '🌱 Producer Agent scanning listings for tomato within 5km…',
            statusColor: 'amber',
            ts: new Date().toISOString(),
          },
          {
            id: 'mock-2',
            sessionId,
            agentName: 'buyer_agent',
            eventType: 'offer_made',
            payload: { price: 28, quantity: 40 },
            humanReadableText: '🛒 Buyer Agent: Offer ₹28/kg for 40kg Tomato',
            statusColor: 'blue',
            ts: new Date().toISOString(),
          },
          {
            id: 'mock-3',
            sessionId,
            agentName: 'producer_agent',
            eventType: 'counter_offer',
            payload: { price: 27 },
            humanReadableText: '🌱 Producer Agent countered: ₹27/kg (waste risk 35%)',
            statusColor: 'blue',
            ts: new Date().toISOString(),
          },
          {
            id: 'mock-4',
            sessionId,
            agentName: 'system',
            eventType: 'confirmed',
            payload: {},
            humanReadableText: '✅ Order CONFIRMED! 40kg at ₹27/kg. Stock: 160kg remaining.',
            statusColor: 'green',
            ts: new Date().toISOString(),
          },
        ]
      })
    }, 2000)

    return () => {
      disconnect()
      clearTimeout(fallbackTimer)
    }
  }, [sessionId])

  // Auto-scroll
  useEffect(() => {
    if (isExpanded) {
      eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [events, isExpanded])

  const latestColor = events.length > 0 ? events[events.length - 1].statusColor : 'amber'
  const colors = STATUS_COLORS[latestColor] || STATUS_COLORS.amber

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      <div
        className={`bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 overflow-hidden ${
          isExpanded ? 'w-96' : 'w-14'
        }`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 cursor-pointer bg-gray-900 text-white rounded-t-xl select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">📡</span>
            {isExpanded && <span className="font-semibold text-sm">Live Agent Activity</span>}
          </div>
          <div className="flex items-center gap-2">
            {/* Connection dot */}
            <span
              className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-amber-400'} animate-pulse`}
              title={connected ? 'Live' : 'Connecting…'}
            />
            {isExpanded && events.length > 0 && (
              <button
                className="text-xs text-gray-400 hover:text-white px-1"
                onClick={(e) => { e.stopPropagation(); setEvents([]) }}
              >
                Clear
              </button>
            )}
            {isExpanded && (
              <span className="text-gray-400 text-xs">{isExpanded ? '▼' : '▲'}</span>
            )}
          </div>
        </div>

        {/* Events list */}
        {isExpanded && (
          <div className="max-h-72 overflow-y-auto p-2 space-y-1">
            {events.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6 italic">Waiting for agent activity…</p>
            )}
            {events.map((event) => {
              const c = STATUS_COLORS[event.statusColor] || STATUS_COLORS.amber
              const isOpen = expandedEventId === event.id

              return (
                <div
                  key={event.id}
                  className={`rounded-lg border ${c.border} ${c.bg} p-2 cursor-pointer transition-all duration-150 hover:opacity-90`}
                  onClick={() => setExpandedEventId(isOpen ? null : event.id)}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base mt-0.5 flex-shrink-0">
                      {AGENT_ICONS[event.agentName] || '🤖'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                        <span className="text-[10px] text-gray-500">
                          {new Date(event.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-800 leading-snug">{event.humanReadableText}</p>

                      {/* Expandable payload */}
                      {isOpen && Object.keys(event.payload || {}).length > 0 && (
                        <div className="mt-1.5 bg-white/70 rounded p-1.5 space-y-0.5">
                          {Object.entries(event.payload).map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-2 text-[10px]">
                              <span className="text-gray-500 font-medium">{k}</span>
                              <span className="text-gray-800">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={eventsEndRef} />
          </div>
        )}

        {/* Collapsed dot indicators */}
        {!isExpanded && (
          <div className="flex flex-col items-center gap-1 p-2">
            <div className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
            {events.length > 0 && (
              <span className="text-[9px] text-gray-500">{events.length}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}