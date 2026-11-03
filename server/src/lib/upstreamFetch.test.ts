import { describe, it, expect, vi, afterEach } from 'vitest'
import { logger } from './logger.js'
import { upstreamFetch } from './upstreamFetch.js'

const URL_ = 'https://example.supabase.co/rest/v1/x'

// A fetch that only ever settles by being aborted: the shape of the stall.
const hanging: typeof fetch = (_input, init) =>
  new Promise((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => reject(init.signal?.reason))
  })

// Headers arrive at once; the body never finishes unless aborted.
const stalledBody: typeof fetch = async (_input, init) => {
  const body = new ReadableStream({
    start(controller) {
      init?.signal?.addEventListener('abort', () => controller.error(init.signal?.reason))
    },
  })
  return new Response(body, { status: 200 })
}

afterEach(() => vi.restoreAllMocks())

describe('upstreamFetch', () => {
  it('fails a call that never answers instead of waiting forever', async () => {
    const error = vi.spyOn(logger, 'error')
    await expect(upstreamFetch(50, 10, hanging)(URL_, { method: 'POST' })).rejects.toThrow()
    expect((error.mock.calls[0]?.[0] as { msg: string }).msg).toMatch(/timed out/)
  })

  it('times out and logs a reply whose body stalls after the headers', async () => {
    const error = vi.spyOn(logger, 'error')
    await expect(upstreamFetch(50, 10, stalledBody)(URL_)).rejects.toThrow()
    expect((error.mock.calls[0]?.[0] as { msg: string }).msg).toMatch(/timed out/)
  })

  it('logs a Supabase server error and still hands it back unchanged', async () => {
    const error = vi.spyOn(logger, 'error')
    const failing: typeof fetch = async () => new Response('{"message":"down"}', { status: 503 })
    const res = await upstreamFetch(1000, 1000, failing)(URL_)
    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ message: 'down' })
    expect((error.mock.calls[0]?.[0] as { msg: string }).msg).toMatch(/503/)
  })

  it('passes a prompt answer straight through without logging', async () => {
    const error = vi.spyOn(logger, 'error')
    const ok: typeof fetch = async () => new Response('{"a":1}', { status: 201 })
    const res = await upstreamFetch(1000, 1000, ok)(URL_)
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ a: 1 })
    expect(error).not.toHaveBeenCalled()
  })
})
