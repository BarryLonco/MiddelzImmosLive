
import { isAuthed } from '@/lib/auth'
import Link from 'next/link'

export default function AdminPage() {
  if (!isAuthed()) {
    return (
      <div className="max-w-md card p-6">
        <div className="text-red-600 font-semibold">Kein Zugriff</div>
        <div className="text-sm mt-2">Bitte zuerst <Link className="underline" href="/login">einloggen</Link>.</div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Admin</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="font-semibold mb-2">Benachrichtigungen</div>
          <p className="text-sm text-slate-600">Telegram-Bot verbinden: setze <code>TELEGRAM_BOT_TOKEN</code> und <code>TELEGRAM_CHAT_ID</code> in den Umgebungsvariablen. Test unten:</p>
          <form action="/api/notify/telegram" method="post" className="mt-3 flex gap-2">
            <input className="input" name="msg" placeholder="Test-Nachricht" />
            <button className="btn" type="submit">Senden</button>
          </form>
        </div>

        <div className="card p-4">
          <div className="font-semibold mb-2">Cron / Checks</div>
          <p className="text-sm text-slate-600">Automatik kann per externem Ping eingerichtet werden (cron-job.org) auf <code>/api/cron/refresh</code>. Button unten stößt manuell an.</p>
          <a className="btn mt-2" href="/api/cron/refresh" target="_blank">Manuell anstoßen</a>
        </div>
      </div>

      <div className="card p-4">
        <div className="font-semibold mb-3">Listing hinzufügen (mit echter URL)</div>
        <form action="/api/admin/add-listing" method="post" className="grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="label">Titel</label>
            <input name="title" className="input" placeholder="z. B. 3-Zimmer-ETW in Schwelm" required />
          </div>
          <div>
            <label className="label">Preis (€)</label>
            <input name="price" className="input" type="number" required />
          </div>
          <div>
            <label className="label">Fläche (m²)</label>
            <input name="size" className="input" type="number" />
          </div>
          <div>
            <label className="label">Ort</label>
            <input name="city" className="input" required />
          </div>
          <div>
            <label className="label">Zimmer</label>
            <input name="rooms" className="input" type="number" />
          </div>
          <div>
            <label className="label">Quelle</label>
            <select name="source" className="input" required>
              <option>ImmoScout24</option>
              <option>ImmoWelt</option>
              <option>Kleinanzeigen</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Original-Link (Exposé-URL)</label>
            <input name="url" className="input" placeholder="https://…" required />
          </div>
          <div className="md:col-span-2 mt-2">
            <button className="btn" type="submit">Speichern</button>
          </div>
        </form>
        <p className="text-xs text-slate-500 mt-3">Hinweis: Vorläufige In-Memory-Speicherung (geht bei Kaltstart verloren). Später DB-Anbindung möglich.</p>
      </div>
    </div>
  )
}
