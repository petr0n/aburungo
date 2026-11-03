import { describe, it, expect } from 'vitest'
import { upstreamFetch } from './upstreamFetch.js'

// A fetch that only ever settles by being aborted: the shape of the stall.
const hanging: typeof fetch = (_input, init) =>
  new Promise((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => reject(init.signal?.reason))
  })

describe('upstreamFetch', () => {
  it('fails a call that never answers instead of waiting forever', async () => {
    const f = upstreamFetch(50, 10, hanging)
    await expect(f('https://example.supabase.co/rest/v1/x', { method: 'POST' })).rejects.toThrow()
  })

  it('passes a prompt answer straight through', async () => {
    const ok: typeof fetch = async () => new Response('{}', { status: 201 })
    const res = await upstreamFetch(50, 10, ok)('https://example.supabase.co/rest/v1/x')
    expect(res.status).toBe(201)
  })
})
