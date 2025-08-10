
import { NextResponse } from 'next/server'
import { seedMock, getListings } from '@/lib/listings'
import { withFlexCities, DEFAULT_CITIES } from '@/lib/cities'
export async function POST(req:Request){const body=await req.json(); const {cities=DEFAULT_CITIES,filters={}}=body||{}; const listCities=withFlexCities(DEFAULT_CITIES,cities||[]); seedMock(listCities); let items=getListings();
const minPrice=parseInt(filters.minPrice||'0'); const maxPrice=parseInt(filters.maxPrice||'0'); const minSize=parseInt(filters.minSize||'0'); const maxPpsm=parseInt(filters.maxPpsm||'0');
items=items.filter(i=>listCities.map(c=>c.toLowerCase()).includes(i.city.toLowerCase())); if(minPrice) items=items.filter(i=>i.price>=minPrice); if(maxPrice) items=items.filter(i=>i.price<=maxPrice); if(minSize) items=items.filter(i=>(i.size||0)>=minSize); if(maxPpsm) items=items.filter(i=>(i.pricePerSqm||999999)<=maxPpsm);
return NextResponse.json({items})}
