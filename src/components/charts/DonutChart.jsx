import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
const colors=['#3d8ef0','#22c55e','#a855f7','#f97316','#eab308','#64748b']
export default function DonutChart({ data }) {
 return <div className='h-64 w-full'><ResponsiveContainer><PieChart><Pie data={data} dataKey='value' nameKey='name' innerRadius={55} outerRadius={90} paddingAngle={2}>{data.map((_,i)=><Cell key={i} fill={colors[i%colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
}
