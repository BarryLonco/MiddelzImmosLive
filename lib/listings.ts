
export type Listing = {
  id: string
  title: string
  price: number
  pricePerSqm?: number
  city: string
  rooms?: number
  size?: number
  source: 'ImmoScout24' | 'ImmoWelt' | 'Kleinanzeigen'
  url?: string              // echte Exposé-URL (optional)
  postedAt: string          // ISO
  updatedAt: string         // ISO
  priceHistory: { at: string; price: number }[]
  status: 'new' | 'updated'
  isMock?: boolean
}

const memory: { listings: Listing[] } = { listings: [] }

const SOURCES: Listing['source'][] = ['ImmoScout24','ImmoWelt','Kleinanzeigen']

function randomBetween(a: number, b: number) {
  return Math.floor(Math.random()*(b-a+1))+a
}

export function portalSearchUrl(source: Listing['source'], title: string, city: string) {
  const q = encodeURIComponent(`${title} ${city}`)
  if (source === 'ImmoScout24') return `https://www.google.com/search?q=site:immobilienscout24.de+${q}`
  if (source === 'ImmoWelt') return `https://www.google.com/search?q=site:immowelt.de+${q}`
  return `https://www.google.com/search?q=site:kleinanzeigen.de+${q}`
}

export function seedMock(cities: string[]) {
  if (memory.listings.length) return
  const now = Date.now()
  for (let i=0;i<22;i++) {
    const city = cities[i % cities.length]
    const size = randomBetween(45, 120)
    const price = randomBetween(85000, 280000)
    const pricePerSqm = Math.round(price / size)
    const src = SOURCES[i % SOURCES.length]
    const id = `mock-${i}`
    const posted = new Date(now - randomBetween(0, 7)*86400000).toISOString()
    const title = `Schöne ${size} m² ${Math.random()>0.5?'ETW':'Wohnung'} in ${city}`
    memory.listings.push({
      id,
      title,
      price,
      pricePerSqm,
      city,
      rooms: randomBetween(2,5),
      size,
      source: src,
      // url leer lassen, damit Button auf "Suche öffnen" geht
      postedAt: posted,
      updatedAt: posted,
      priceHistory: [{ at: posted, price }],
      status: 'new',
      isMock: true
    })
  }
}

export function getListings() {
  return memory.listings.sort((a,b)=> new Date(b.updatedAt).getTime()-new Date(a.updatedAt).getTime())
}

export function applyRandomPriceMoves(prob=0.5) {
  const now = new Date().toISOString()
  for (const l of memory.listings) {
    if (Math.random() < prob) {
      const delta = Math.floor(l.price * (Math.random()*0.06 - 0.03))
      if (delta !== 0) {
        l.price += delta
        l.pricePerSqm = l.size ? Math.round(l.price / l.size) : l.pricePerSqm
        l.priceHistory.push({ at: now, price: l.price })
        l.updatedAt = now
        l.status = 'updated'
      }
    } else {
      l.status = 'new'
    }
  }
}

export function addListing(listing: Listing) {
  // Fallbacks
  const now = new Date().toISOString()
  listing.id ||= `manual-${Date.now()}`
  listing.updatedAt ||= now
  listing.postedAt ||= now
  listing.priceHistory ||= [{ at: listing.postedAt, price: listing.price }]
  listing.status = 'new'
  listing.isMock = false
  memory.listings.unshift(listing)
}


export function setListingUrl(id: string, url: string) {
  const idx = memory.listings.findIndex(l => l.id === id)
  if (idx >= 0) {
    memory.listings[idx].url = url
    memory.listings[idx].isMock = false
    memory.listings[idx].updatedAt = new Date().toISOString()
    memory.listings[idx].status = 'updated'
  }
}
