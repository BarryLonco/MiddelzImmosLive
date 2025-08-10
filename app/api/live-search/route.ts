
import { NextResponse } from 'next/server'
import { slugCity } from '@/lib/slug'

type Source = 'ImmoScout24' | 'ImmoWelt' | 'Kleinanzeigen'

function portalUrls(city: string) {
  const s = slugCity(city)
  return [
    { source: 'ImmoScout24' as Source, url: `https://www.immobilienscout24.de/Suche/de/nordrhein-westfalen/${s}/wohnung-kaufen` },
    { source: 'ImmoWelt' as Source, url: `https://www.immowelt.de/liste/${s}/wohnungen/kaufen?sort=createdate` },
    { source: 'Kleinanzeigen' as Source, url: `https://www.kleinanzeigen.de/s-wohnung-kaufen/${s}/k0c196` },
  ]
}

function absoluteUrl(source: Source, href: string) {
  if (href.startsWith('http')) return href
  const base = source === 'ImmoScout24' ? 'https://www.immobilienscout24.de'
    : source === 'ImmoWelt' ? 'https://www.immowelt.de'
    : 'https://www.kleinanzeigen.de'
  return base + href
}

async function fetchText(url: string) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36',
      'accept': 'text/html,application/xhtml+xml'
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Fetch failed ' + res.status)
  return await res.text()
}

function extractLinks(source: Source, html: string) {
  const urls = new Set<string>()
  const patterns = source === 'ImmoScout24'
    ? [/href="(\/expose\/[^"]+)"/g, /href="(https:\/\/www\.immobilienscout24\.de\/expose\/[^"]+)"/g]
    : source === 'ImmoWelt'
    ? [/href="(\/expose\/[^"]+)"/g, /href="(https:\/\/www\.immowelt\.de\/expose\/[^"]+)"/g]
    : [/href="(\/s-anzeige\/[^"]+)"/g, /href="(https:\/\/www\.kleinanzeigen\.de\/s-anzeige\/[^"]+)"/g]

  for (const re of patterns) {
    let m: RegExpExecArray | null
    while ((m = re.exec(html)) !== null) {
      urls.add(absoluteUrl(source, m[1]))
    }
  }
  return Array.from(urls)
}

function parseEuroToInt(s: string): number | undefined {
  const cleaned = s.replace(/[^0-9.,]/g, '')
  if (!cleaned) return undefined
  if (cleaned.includes(',')) {
    const t = cleaned.replace(/\./g, '').replace(/,/g, '.')
    const n = Math.round(parseFloat(t))
    return Number.isFinite(n) ? n : undefined
  }
  const n = Math.round(parseFloat(cleaned.replace(/\./g, '')))
  return Number.isFinite(n) ? n : undefined
}

function firstMatch(re: RegExp, html: string): string | undefined {
  const m = re.exec(html)
  return m ? m[1].trim() : undefined
}

function tryJson<T=any>(s: string): T | null {
  try { return JSON.parse(s) } catch { return null }
}

function fromJsonLd(html: string) {
  const blocks: any[] = []
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim()
    const candidate = tryJson<any>(raw)
    if (candidate) blocks.push(candidate)
  }
  // Flatten @graph if present
  const flat: any[] = []
  for (const b of blocks) {
    if (Array.isArray(b)) flat.push(...b)
    else if (b && typeof b === 'object' && Array.isArray(b['@graph'])) flat.push(...b['@graph'])
    else flat.push(b)
  }
  let price: number | undefined, size: number | undefined, rooms: number | undefined, title: string | undefined
  for (const obj of flat) {
    if (!obj || typeof obj !== 'object') continue
    // title candidates
    if (!title && typeof obj.name === 'string') title = obj.name
    if (!title && typeof obj.headline === 'string') title = obj.headline
    // price in offers
    const offers = obj.offers || obj.offer || obj.Offer
    if (offers) {
      const arr = Array.isArray(offers) ? offers : [offers]
      for (const off of arr) {
        const p = off && (off.price || off.lowPrice || off.highPrice)
        const pn = typeof p === 'string' ? parseEuroToInt(p) : (typeof p === 'number' ? Math.round(p) : undefined)
        if (pn && (!price || pn > price)) price = pn
      }
    }
    // size
    const fs = obj.floorSize || obj.area || obj.size || obj.livingArea || obj.livingSpace
    if (fs) {
      if (typeof fs === 'number') size = Math.round(fs)
      else if (typeof fs === 'string') size = Math.round(parseFloat(fs.replace(',', '.')))
      else if (typeof fs === 'object') {
        const v = fs.value || fs.amount
        if (typeof v === 'number') size = Math.round(v)
        else if (typeof v === 'string') size = Math.round(parseFloat(v.replace(',', '.')))
      }
    }
    // rooms
    const rr = obj.numberOfRooms || obj.rooms
    if (typeof rr === 'number') rooms = rr
    else if (typeof rr === 'string') rooms = parseFloat(rr.replace(',', '.'))
  }
  return { title, price, size, rooms }
}

function extractDetails(source: Source, html: string) {
  // Prefer JSON-LD
  let { title, price, size, rooms } = fromJsonLd(html)

  // Fallbacks: portal-specific JSON
  if (!price) {
    const m = html.match(/"purchasePrice"\s*:\s*(\d{4,8})/)
    if (m) price = parseInt(m[1])
  }
  if (!size) {
    const m = html.match(/"livingSpace"\s*:\s*(\d{2,4}(?:\.\d+)?)/)
    if (m) size = Math.round(parseFloat(m[1]))
  }
  if (!rooms) {
    const m = html.match(/"numberOfRooms"\s*:\s*(\d+(?:\.\d+)?)/)
    if (m) rooms = parseFloat(m[1])
  }

  // Generic regex fallbacks
  if (!price) {
    let priceStr = firstMatch(/Kaufpreis[^0-9]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i, html)
    if (!priceStr) priceStr = firstMatch(/Preis[^0-9]*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*€/i, html)
    if (!priceStr) priceStr = firstMatch(/(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*€/i, html)
    price = priceStr ? parseEuroToInt(priceStr) : undefined
  }
  if (!size) {
    let sizeStr = firstMatch(/Wohnfl(?:äche)?[^0-9]*(\d{2,4}(?:,\d{1,2})?)/i, html)
    if (!sizeStr) sizeStr = firstMatch(/(\d{2,4}(?:,\d{1,2})?)\s*(?:m²|m2)/i, html)
    size = sizeStr ? Math.round(parseFloat(sizeStr.replace(',', '.'))) : undefined
  }
  if (!rooms) {
    const roomsStr = firstMatch(/(\d+(?:,\d)?)\s*Zimmer/i, html)
    rooms = roomsStr ? parseFloat(roomsStr.replace(',', '.')) : undefined
  }
  if (!title) {
    title = firstMatch(/<h1[^>]*>(.*?)<\/h1>/is, html)?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
      || firstMatch(/<title[^>]*>([^<]{5,140})<\/title>/i, html)?.replace(/\s+\|.*$/, '').replace(/\s+-\s+.*$/, '').trim()
  }

  // Plausibility guardrails
  if (price && price <= 1000) price = undefined // „1 € VB“ etc.
  if (size && (size < 10 || size > 500)) size = undefined
  if (rooms && (rooms < 1 || rooms > 10)) rooms = undefined

  return { title, price, size, rooms }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { cities = [] } = body || {}
  const selected: string[] = Array.isArray(cities) && cities.length ? cities : []

  const out: any[] = []
  for (const city of selected) {
    const targets = portalUrls(city)
    for (const t of targets) {
      try {
        const html = await fetchText(t.url)
        const links = extractLinks(t.source, html).slice(0, 8)
        for (const u of links) {
          try {
            const itemHtml = await fetchText(u)
            const d = extractDetails(t.source, itemHtml)
            const pricePerSqm = d.price && d.size ? Math.round(d.price / d.size) : undefined
            out.push({
              id: `${t.source}-${city}-${u}`.slice(0, 200),
              title: d.title || `${city}: Exposé (${t.source})`,
              price: d.price || 0,
              pricePerSqm,
              city,
              rooms: d.rooms,
              size: d.size,
              source: t.source,
              url: u,
              postedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              priceHistory: [{ at: new Date().toISOString(), price: d.price || 0 }],
              status: 'new',
              isMock: false,
            })
          } catch (e) { /* skip item */ }
        }
      } catch (e) { /* skip portal */ }
    }
  }

  return NextResponse.json({ items: out })
}
