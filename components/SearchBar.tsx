
'use client'
import { useState } from 'react'
export default function SearchBar({defaultCities,onSearch}:{defaultCities:string[],onSearch:(cities:string[],filters:any)=>void}){
  const [cities,setCities]=useState<string[]>(defaultCities)
  const [extraCity,setExtraCity]=useState('')
  const [minPrice,setMinPrice]=useState('')
  const [maxPrice,setMaxPrice]=useState('')
  const [minSize,setMinSize]=useState('')
  const [maxPpsm,setMaxPpsm]=useState('')
  const addCity=()=>{const c=extraCity.trim();if(!c)return; if(!cities.map(s=>s.toLowerCase()).includes(c.toLowerCase())) setCities([...cities,c]); setExtraCity('')}
  return(<div className="card p-4 flex flex-col gap-3">
    <div className="grid md:grid-cols-6 gap-3">
      <div className="md:col-span-2">
        <div className="label">Städte</div>
        <div className="flex flex-wrap gap-2 mt-1">{cities.map(c=><span key={c} className="badge bg-slate-100 text-slate-700">{c}</span>)}</div>
        <div className="flex gap-2 mt-2"><input className="input" placeholder="Stadt hinzufügen" value={extraCity} onChange={e=>setExtraCity(e.target.value)}/><button className="btn" onClick={addCity}>Hinzufügen</button></div>
      </div>
      <div><div className="label">Preis min</div><input className="input" value={minPrice} onChange={e=>setMinPrice(e.target.value)} placeholder="z. B. 80000"/></div>
      <div><div className="label">Preis max</div><input className="input" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="z. B. 250000"/></div>
      <div><div className="label">Fläche min (m²)</div><input className="input" value={minSize} onChange={e=>setMinSize(e.target.value)} placeholder="z. B. 50"/></div>
      <div><div className="label">€/m² max</div><input className="input" value={maxPpsm} onChange={e=>setMaxPpsm(e.target.value)} placeholder="z. B. 2800"/></div>
    </div>
    <div className="flex justify-between items-center mt-2">
      <div className="text-sm text-slate-500">Sortierung: Neueste zuerst · größte Preisreduktion · günstigste €/m²</div>
      <button className="btn" onClick={()=>onSearch(cities,{minPrice,maxPrice,minSize,maxPpsm})}>Suchen</button>
    </div>
  </div>)
}
