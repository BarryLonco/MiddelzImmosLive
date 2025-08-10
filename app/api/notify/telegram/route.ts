
import { NextResponse } from 'next/server'
export async function POST(req:Request){const data=await req.formData(); const msg=(data.get('msg') as string)||'Test'; const token=process.env.TELEGRAM_BOT_TOKEN; const chatId=process.env.TELEGRAM_CHAT_ID; if(!token||!chatId){return NextResponse.json({ok:false,error:'Env TELEGRAM_BOT_TOKEN/CHAT_ID fehlen'},{status:400})}
const url=`https://api.telegram.org/bot${token}/sendMessage`; const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text:msg})}); const j=await r.json(); return NextResponse.json(j)}
