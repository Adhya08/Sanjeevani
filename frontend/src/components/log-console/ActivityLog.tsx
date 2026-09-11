import React, { useState, useEffect, useRef } from 'react'
import { connectAgentLog, AgentEvent } from '../../services/api'

interface ActivityLogProps {
  sessionId?: string
}

const STATUS_TOKENS: Record<string, { dot: string; bg: string; border: string; text: string }> = {
  amber: { dot: 'bg-turmeric', bg: 'bg-paper', border: 'border-turmeric', text: 'text-ink' },
  blue:  { dot: 'bg-slate', bg: 'bg-paper', border: 'border-slate', text: 'text-ink' },
  green: { dot: 'bg-moss', bg: 'bg-paper', border: 'border-moss', text: 'text-ink' },
  red:   { dot: 'bg-rust', bg: 'bg-paper', border: 'border-rust', text: 'text-ink' },
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
        setEvents((prev) => [...prev.slice(-49), event])
      },
      (history) => {
        setConnected(true)
        setEvents(history)
      },
      sessionId,
    )

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
            humanReadableText: 'Producer agent scanning mandi lots for tomato within 5km…',
            statusColor: 'amber',
            ts: new Date().toISOString(),
          },
          {
            id: 'mock-2',
            sessionId,
            agentName: 'buyer_agent',
            eventType: 'offer_made',
            payload: { price: 28, quantity: 40 },
            humanReadableText: 'Buyer agent bid registered: ₹28/kg for 40kg tomato',
            statusColor: 'blue',
            ts: new Date().toISOString(),
          },
          {
            id: 'mock-3',
            sessionId,
            agentName: 'producer_agent',
            eventType: 'counter_offer',
            payload: { price: 27 },
            humanReadableText: 'Producer desk countered: ₹27/kg (waste risk score: 35%)',
            statusColor: 'blue',
            ts: new Date().toISOString(),
          },
          {
            id: 'mock-4',
            sessionId,
            agentName: 'system',
            eventType: 'confirmed',
            payload: {},
            humanReadableText: 'Order confirmed: 40kg at ₹27/kg. Stock: 160kg remaining.',
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

  useEffect(() => {
    if (isExpanded) {
      eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [events, isExpanded])

  const latestColor = events.length > 0 ? events[events.length - 1].statusColor : 'amber'
  const colors = STATUS_TOKENS[latestColor] || STATUS_TOKENS.amber

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      <div
        className={`bg-paper border-2 border-ink transition-none ${
          isExpanded ? 'w-96' : 'w-12'
        }`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-2.5 cursor-pointer bg-slate text-paper select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif font-bold">Ledger</span>
            {isExpanded && <span className="text-xs text-paper/80">Autonomous telemetry feed</span>}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2 h-2 ${connected ? 'bg-moss' : 'bg-turmeric'}`}
              title={connected ? 'Live' : 'Connecting…'}
            />
            {isExpanded && events.length > 0 && (
              <button
                type="button"
                className="text-[10px] text-paper/70 hover:text-paper px-1 focus-visible:ring-1 focus-visible:ring-turmeric focus-visible:outline-none"
                onClick={(e) => {
                  e.stopPropagation()
                  setEvents([])
                }}
              >
                Clear
              </button>
            )}
            {isExpanded && (
              <span className="text-paper/60 text-[10px]">{isExpanded ? '▼' : '▲'}</span>
            )}
          </div>
        </div>

        {/* Events list */}
        {isExpanded && (
          <div className="max-h-72 overflow-y-auto p-2 space-y-1.5 bg-paper text-ink">
            {events.length === 0 && (
              <p className="text-xs text-ink/50 text-center py-6">Waiting for agent activity…</p>
            )}
            {events.map((event) => {
              const c = STATUS_TOKENS[event.statusColor] || STATUS_TOKENS.amber
              const isOpen = expandedEventId === event.id

              return (
                <div
                  key={event.id}
                  className={`border ${c.border} ${c.bg} p-2 cursor-pointer transition-none`}
                  onClick={() => setExpandedEventId(isOpen ? null : event.id)}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-1.5 h-1.5 ${c.dot}`} />
                        <span className="text-[10px] text-ink/60 tabular-nums">
                          {new Date(event.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span className="text-[10px] text-ink/50 font-mono">[{event.agentName}]</span>
                      </div>
                      <p className="text-xs text-ink leading-snug">{event.humanReadableText}</p>

                      {isOpen && Object.keys(event.payload || {}).length > 0 && (
                        <div className="mt-1.5 bg-paper/90 border border-ink/20 p-1.5 space-y-0.5 tabular-nums">
                          {Object.entries(event.payload).map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-2 text-[10px]">
                              <span className="text-ink/60 font-medium">{k}</span>
                              <span className="text-ink font-bold">{String(v)}</span>
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
          <div className="flex flex-col items-center gap-1 p-2 bg-paper cursor-pointer" onClick={() => setIsExpanded(true)}>
            <div className={`w-2 h-2 ${colors.dot}`} />
            {events.length > 0 && (
              <span className="text-[9px] text-ink/70 tabular-nums">{events.length}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}