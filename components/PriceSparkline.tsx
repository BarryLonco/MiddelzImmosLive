
'use client'
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'
export default function PriceSparkline({ data }:{ data:{at:string,price:number}[] }){
  const chartData=data.map(d=>({x:new Date(d.at).toLocaleDateString(),y:d.price}))
  return(<div className="h-24 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><XAxis dataKey="x" hide/><YAxis hide domain={['auto','auto']}/><Tooltip/><Line type="monotone" dataKey="y" dot={false} strokeWidth={2}/></LineChart></ResponsiveContainer></div>)
}
