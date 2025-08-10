import { cookies } from 'next/headers'
export function isAuthed(){return cookies().get('auth')?.value==='1'}
