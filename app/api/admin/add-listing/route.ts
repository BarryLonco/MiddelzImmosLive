
import { NextResponse } from 'next/server'
import { addListing } from '@/lib/listings'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const auth = cookies().get('auth')?.value === '1'
  if (!auth) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const title = String(form.get('title') || 'Ohne Titel')
  const price = parseInt(String(form.get('price') || '0'))
  const size = parseInt(String(form.get('size') || '0')) || undefined
  const city = String(form.get('city') || '')
  const rooms = parseInt(String(form.get('rooms') || '0')) || undefined
  const source = String(form.get('source') || 'ImmoScout24') as 'ImmoScout24' | 'ImmoWelt' | 'Kleinanzeigen'
  const url = String(form.get('url') || '')

  const now = new Date().toISOString()
  addListing({
    id: `manual-${Date.now()}`,
    title,
    price,
    pricePerSqm: size ? Math.round(price/size) : undefined,
    city,
    rooms,
    size,
    source,
    url,
    postedAt: now,
    updatedAt: now,
    priceHistory: [{ at: now, price }],
    status: 'new',
    isMock: false
  })

  return NextResponse.redirect(new URL('/?added=1', req.url))
}
