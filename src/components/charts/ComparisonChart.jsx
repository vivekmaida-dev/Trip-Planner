import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
export default function ComparisonChart({ data }) {
 return <div className='h-72'><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray='3 3' stroke='#1e2d45'/><XAxis dataKey='category' stroke='#94a3b8'/><YAxis stroke='#94a3b8'/><Tooltip /><Legend /><Bar dataKey='tripA' fill='#3d8ef0'/><Bar dataKey='tripB' fill='#a855f7'/></BarChart></ResponsiveContainer></div>
}
