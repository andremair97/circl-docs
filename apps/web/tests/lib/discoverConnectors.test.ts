import { describe, it, expect } from 'vitest'
import path from 'path'
import { fileURLToPath } from 'url'
import { discoverConnectors } from '../../lib/discoverConnectors'

// Derive __dirname in ESM context
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Precompute paths to repo root and apps/web
const webDir = path.resolve(__dirname, '../..')
const repoRoot = path.resolve(webDir, '..', '..')

describe('discoverConnectors', () => {
  it('finds connectors from repo root', async () => {
    const connectors = await discoverConnectors(repoRoot)
    expect(connectors.some((c) => c.slug === 'ifixit')).toBe(true)
  })

  it('finds connectors from apps/web', async () => {
    const connectors = await discoverConnectors(webDir)
    expect(connectors.some((c) => c.slug === 'ifixit')).toBe(true)
  })
})

