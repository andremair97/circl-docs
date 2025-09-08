'use server'

import fs from 'fs'
import path from 'path'
import { CONNECTOR_CATALOG, prettifySlug } from './connectorCatalog'

export type DiscoveredConnector = { slug: string; title: string; description?: string }

/**
 * Discover connector routes by scanning the app directory on the server.
 * Node runtime only. Returns [] if not found or on error.
 *
 * @param cwd Base directory to resolve from. Defaults to `process.cwd()`.
 */
export async function discoverConnectors(cwd: string = process.cwd()): Promise<DiscoveredConnector[]> {
  try {
    // Resolve the path to the Next.js app/connectors directory.
    // Support running from either the repo root or the apps/web package by
    // checking both "app/connectors" and "apps/web/app/connectors".
    const candidates = [
      path.resolve(cwd, 'app/connectors'),
      path.resolve(cwd, 'apps/web/app/connectors'),
    ]
    const appDir = candidates.find((dir) => fs.existsSync(dir))
    if (!appDir) return []

    const entries = fs.readdirSync(appDir, { withFileTypes: true })
    const slugs = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)

    const connectors: DiscoveredConnector[] = []
    for (const slug of slugs) {
      const pageTsx = path.join(appDir, slug, 'page.tsx')
      const pageJsx = path.join(appDir, slug, 'page.jsx')
      if (fs.existsSync(pageTsx) || fs.existsSync(pageJsx)) {
        const meta = CONNECTOR_CATALOG[slug]
        connectors.push({
          slug,
          title: meta?.title ?? prettifySlug(slug),
          description: meta?.description,
        })
      }
    }
    // Sort alphabetically by title for a stable UI
    connectors.sort((a, b) => a.title.localeCompare(b.title, 'en'))
    return connectors
  } catch {
    return []
  }
}
