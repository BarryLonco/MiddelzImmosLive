
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
export const dynamic='force-dynamic'
async function login(formData:FormData){'use server'; const password=formData.get('password'); const correct=process.env.APP_PASSWORD||'NicoUndAnne2025'; if(password===correct){cookies().set('auth','1',{httpOnly:true,path:'/'}); return redirect('/admin')} return redirect('/login?err=1')}
export default function LoginPage({searchParams}:{searchParams:{err?:string}}){const err=searchParams?.err; return(<div className="max-w-sm mx-auto card p-6"><h1 className="text-xl font-semibold mb-4">Login</h1>{err&&<div className="mb-2 text-sm text-red-600">Falsches Passwort</div>}<form action={login}><div className="label">Passwort</div><input name="password" type="password" className="input mt-1" placeholder="Passwort"/><button className="btn mt-4" type="submit">Einloggen</button></form></div>)}
