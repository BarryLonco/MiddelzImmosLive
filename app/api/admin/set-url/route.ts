
import { NextResponse } from 'next/server'
import { setListingUrl } from '@/lib/listings'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const authed = cookies().get('auth')?.value === '1'
  if (!authed) {
    return NextResponse.json({ ok: false, error: 'Bitte zuerst einloggen.' }, { status: 401 })
  }
  const data = await req.json()
  const id = String(data.id || '')
  const url = String(data.url || '')
  if (!id || !url) {
    return NextResponse.json({ ok: false, error: 'id und url sind erforderlich.' }, { status: 400 })
  }
  setListingUrl(id, url)
  return NextResponse.json({ ok: true })
}
