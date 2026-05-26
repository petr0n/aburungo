import pino from 'pino'

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export type LogEntry = {
  level: LogLevel
  time: string
  msg: string
  route?: string
  method?: string
  status?: number
  duration?: number
  err?: string
  [key: string]: unknown
}

// Rolling in-memory ring buffer — last 500 log entries
const RING_SIZE = 500
const ring: LogEntry[] = []

function pushToRing(entry: LogEntry) {
  if (ring.length >= RING_SIZE) ring.shift()
  ring.push(entry)
}

export function getLogEntries(level?: LogLevel, limit = 100): LogEntry[] {
  const LEVEL_ORDER: LogLevel[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
  const minIdx = level ? LEVEL_ORDER.indexOf(level) : 0
  const filtered = level
    ? ring.filter((e) => LEVEL_ORDER.indexOf(e.level) >= minIdx)
    : [...ring]
  return filtered.slice(-Math.min(limit, RING_SIZE)).reverse()
}

// Pino destination that writes to stdout AND the ring buffer
const dest = pino.destination({ sync: false })

const baseLogger = pino(
  {
    level: process.env.LOG_LEVEL ?? 'info',
    formatters: {
      level(label) {
        return { level: label as LogLevel }
      },
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  },
  {
    write(msg: string) {
      dest.write(msg)
      try {
        const entry = JSON.parse(msg) as LogEntry
        pushToRing(entry)
      } catch {
        // non-JSON line — ignore
      }
    },
  },
)

export const logger = baseLogger
