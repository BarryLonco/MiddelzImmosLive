
import './globals.css'
import Link from 'next/link'
import { cookies } from 'next/headers'

export const metadata = { title: 'middeldorfimmo', description: 'Privates Markt-Dashboard' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const authed = cookies().get('auth')?.value === '1'
  return (
    <html lang="de"><body>
      <header className="border-b bg-white">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="logo" className="h-8"/><span className="font-bold text-xl">middeldorfimmo</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="hover:text-brand">Suche</Link>
            {authed && <Link href="/admin" className="hover:text-brand">Admin</Link>}
            {!authed ? <Link href="/login" className="btn">Login</Link> :
              <form action="/login/logout" method="post"><button className="btn" type="submit">Logout</button></form>}
          </nav>
        </div>
      </header>
      <main className="container py-6">{children}</main>
      <footer className="container py-12 text-sm text-slate-500">
        <div className="flex flex-col gap-2">
          <div>© {new Date().getFullYear()} middeldorfimmo – privat.</div>
          <div className="flex gap-4"><Link href="/legal/impressum">Impressum</Link><Link href="/legal/datenschutz">Datenschutz</Link></div>
        </div>
      </footer>
    </body></html>
  )
}
