
import Link from 'next/link'
import PriceSparkline from './PriceSparkline'
import { portalSearchUrl } from '@/lib/listings'
import dynamic from 'next/dynamic'

const AttachUrl = dynamic(() => import('./AttachUrl'), { ssr: false })

export default function ListingCard({ item }: { item: any }) {
  const hasDirect = !!item.url
  const searchUrl = portalSearchUrl(item.source, item.title, item.city)
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">{item.title}</div>
        <div className="flex items-center gap-2">
          {item.status === 'new' && <span className="badge-new">Neu</span>}
          {item.priceHistory && item.priceHistory.length > 1 && <span className="badge-drop">Preis geändert</span>}
          <span className="text-xs text-slate-500">{item.source}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="label">Preis</div>
          <div className="font-semibold">{item.price ? item.price.toLocaleString('de-DE') + ' €' : '–'}</div>
        </div>
        <div>
          <div className="label">€/m²</div>
          <div className="font-semibold">{item.pricePerSqm ? item.pricePerSqm.toLocaleString('de-DE') : '–'}</div>
        </div>
        <div>
          <div className="label">Fläche</div>
          <div className="font-semibold">{item.size ? item.size + ' m²' : '–'}</div>
        </div>
        <div>
          <div className="label">Ort</div>
          <div className="font-semibold">{item.city || '–'}</div>
        </div>
      </div>
      <PriceSparkline data={item.priceHistory} />
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs text-slate-500">
        <div>Online seit: {new Date(item.postedAt).toLocaleDateString()}</div>
        <div className="flex flex-wrap gap-2">
          {hasDirect && (
            <Link href={item.url} target="_blank" rel="noopener noreferrer" className="btn">
              Zur Anzeige
            </Link>
          )}
          <Link href={searchUrl} target="_blank" rel="noopener noreferrer" className="btn">
            {hasDirect ? 'Zur Quelle-Suche' : 'Suche öffnen'}
          </Link>
          {!hasDirect && <AttachUrl id={item.id} />}
        </div>
      </div>
    </div>
  )
}
