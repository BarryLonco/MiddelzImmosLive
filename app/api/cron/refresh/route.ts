
import { NextResponse } from 'next/server'
import { seedMock, applyRandomPriceMoves, addListing, getListings } from '@/lib/listings'
import { DEFAULT_CITIES } from '@/lib/cities'
export const dynamic='force-dynamic'
export async function GET(){ seedMock(DEFAULT_CITIES); applyRandomPriceMoves(0.5);
  if(Math.random()<0.5){ const city=DEFAULT_CITIES[Math.floor(Math.random()*DEFAULT_CITIES.length)]; const now=new Date().toISOString(); const price=Math.floor(90000+Math.random()*180000); const size=Math.floor(45+Math.random()*80);
    addListing({id:`new-${Date.now()}`, title:`Neue Wohnung in ${city}`, price, pricePerSqm:Math.round(price/size), city, rooms:3, size, source:(['ImmoScout24','ImmoWelt','Kleinanzeigen'] as const)[Math.floor(Math.random()*3)], url:`https://example.com/new/${Date.now()}`, postedAt:now, updatedAt:now, priceHistory:[{at:now,price}], status:'new'})}
  return NextResponse.json({ok:true,count:getListings().length})}
