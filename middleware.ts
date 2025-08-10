
import { NextRequest, NextResponse } from 'next/server'
export function middleware(req:NextRequest){ if(req.nextUrl.pathname.startsWith('/admin')){ const authed=req.cookies.get('auth')?.value==='1'; if(!authed){ return NextResponse.redirect(new URL('/login',req.url)) } } return NextResponse.next() }
export const config={ matcher:['/admin/:path*'] }
