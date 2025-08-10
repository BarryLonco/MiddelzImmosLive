
'use client'
import { useState } from 'react'

export default function AttachUrl({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/set-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, url })
      })
      if (!res.ok) {
        const j = await res.json().catch(()=>({error:'Fehler'}))
        setMsg(j.error || 'Fehler beim Speichern')
      } else {
        setMsg('Gespeichert. Seite lädt neu…')
        setTimeout(()=> window.location.reload(), 500)
      }
    } catch (e:any) {
      setMsg('Netzwerkfehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {!open ? (
        <button className="btn" onClick={()=>setOpen(true)}>Link setzen</button>
      ) : (
        <div className="flex items-center gap-2">
          <input className="input" placeholder="https://… Exposé-URL" value={url} onChange={e=>setUrl(e.target.value)} />
          <button className="btn" onClick={submit} disabled={loading}>{loading?'Speichere…':'Speichern'}</button>
          <button className="btn" onClick={()=>setOpen(false)}>Abbrechen</button>
        </div>
      )}
      {msg && <span className="text-xs text-slate-500">{msg}</span>}
    </div>
  )
}
