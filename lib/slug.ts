
export function slugCity(name: string) {
  const map: Record<string, string> = { 'ä':'ae','ö':'oe','ü':'ue','ß':'ss' }
  return name.toLowerCase()
    .replace(/[äöüß]/g, m => map[m] || m)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}
