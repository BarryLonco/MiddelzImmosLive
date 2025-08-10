
# middeldorfimmo (MVP) – Vercel Hobby kompatibel
- Täglicher Cron um 06:00 UTC (~08:00 Berlin) statt stündlich.
- Ansonsten identisch: Login (Passwort `APP_PASSWORD` oder Fallback `NicoUndAnne2025`), Suche, Mock-Daten, Admin.

Deploy: Projekt bei Vercel importieren (Git oder Upload), Env `APP_PASSWORD` setzen (optional), Deploy.  
Cron-URL: `/api/cron/refresh` (manuell anstoßbar).
