import { logger } from './logger.js'

// Every Supabase call (auth and data) goes through this. Two jobs:
// - A time limit, so a call that never answers fails the request instead of
//   leaving the client waiting forever. Nightly walks twice saw a progress save
//   arrive and never get a response (issue #156).
// - A record of calls that were slow, failed server-side, timed out or broke,
//   so the next stall shows whether Supabase was the part that hung.
//
// The body is read here rather than by the caller: fetch resolves on headers,
// so a body that stalls would otherwise escape both the timing and the log.
// Supabase replies are small JSON, so buffering them costs nothing.
export function upstreamFetch(timeoutMs = 15_000, slowMs = 2_000, base: typeof fetch = fetch): typeof fetch {
  return async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
    const what = `${init?.method ?? 'GET'} ${url.pathname}`
    const timeout = AbortSignal.timeout(timeoutMs)
    const signal = init?.signal ? AbortSignal.any([init.signal, timeout]) : timeout
    const t0 = Date.now()
    try {
      const res = await base(input, { ...init, signal })
      const body = await res.arrayBuffer()
      const ms = Date.now() - t0
      // 4xx is ordinary flow (a bad token is a 401); 5xx means Supabase failed.
      if (res.status >= 500) logger.error({ msg: `supabase ${what} ${res.status} ${ms}ms` })
      else if (ms >= slowMs) logger.warn({ msg: `supabase slow ${what} ${res.status} ${ms}ms` })
      return new Response(res.status === 204 || res.status === 304 ? null : body, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      })
    } catch (err) {
      const why = timeout.aborted ? `timed out after ${timeoutMs}ms` : String(err)
      logger.error({ msg: `supabase ${what} ${why}` })
      throw err
    }
  }
}
