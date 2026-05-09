import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function ExpenseTracker() {
  const [members, setMembers] = useState(['Aman', 'Riya'])
  const [expenses, setExpenses] = useState([])
  const [entry, setEntry] = useState({
    payer: 'Aman',
    amount: 0,
    category: 'food',
    split: 'equal',
    participants: ['Aman', 'Riya'],
  })

  const addExpense = () => {
    if (!entry.amount) return
    setExpenses((prev) => [{ ...entry, id: Date.now(), amount: Number(entry.amount) }, ...prev])
  }

  const balances = useMemo(() => {
    const map = Object.fromEntries(members.map((m) => [m, 0]))
    expenses.forEach((exp) => {
      const participants = exp.participants?.length ? exp.participants : members
      const split = exp.amount / Math.max(participants.length, 1)
      map[exp.payer] += exp.amount
      participants.forEach((p) => {
        map[p] -= split
      })
    })
    return map
  }, [expenses, members])

  const settlement = useMemo(() => {
    const debtors = []
    const creditors = []
    Object.entries(balances).forEach(([name, value]) => {
      if (value < 0) debtors.push([name, -value])
      if (value > 0) creditors.push([name, value])
    })
    const tx = []
    let i = 0
    let j = 0
    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i][1], creditors[j][1])
      tx.push(`${debtors[i][0]} pays ${creditors[j][0]} ₹${pay.toFixed(0)}`)
      debtors[i][1] -= pay
      creditors[j][1] -= pay
      if (debtors[i][1] < 1) i += 1
      if (creditors[j][1] < 1) j += 1
    }
    return tx
  }, [balances])

  const exportText = () => navigator.clipboard.writeText(settlement.join('\n'))

  return (
    <div className='space-y-4'>
      <Card>
        <h2 className='section-title'>Expense Tracker</h2>
        <div className='mb-3 flex flex-wrap gap-2'>
          {members.map((m) => (
            <span key={m} className='rounded-full bg-bg-elevated px-3 py-1 text-xs'>
              {m}
            </span>
          ))}
          <button className='tab-btn' onClick={() => setMembers((prev) => [...prev, `Member ${prev.length + 1}`])}>
            + Member
          </button>
        </div>

        <div className='grid gap-2 sm:grid-cols-5'>
          <select className='input-base' value={entry.payer} onChange={(e) => setEntry({ ...entry, payer: e.target.value })}>
            {members.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <input className='input-base' type='number' placeholder='Amount' value={entry.amount} onChange={(e) => setEntry({ ...entry, amount: e.target.value })} />
          <select className='input-base' value={entry.category} onChange={(e) => setEntry({ ...entry, category: e.target.value })}>
            {['food', 'transport', 'stay', 'activity', 'other'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select className='input-base' value={entry.split} onChange={(e) => setEntry({ ...entry, split: e.target.value })}>
            <option value='equal'>Equal</option>
            <option value='some'>Only some people</option>
          </select>
          <Button onClick={addExpense}>Add</Button>
        </div>
      </Card>

      <Card>
        <h3 className='section-title'>Balances</h3>
        <div className='grid gap-2 sm:grid-cols-2'>
          {Object.entries(balances).map(([member, value]) => (
            <p key={member} className='text-sm'>
              {member}:{' '}
              <span className={value >= 0 ? 'text-accent-green' : 'text-accent-orange'}>
                ₹{value.toFixed(0)}
              </span>
            </p>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className='section-title'>Settle Up</h3>
        {settlement.length === 0 ? (
          <p className='text-sm text-text-secondary'>All settled.</p>
        ) : (
          <ul className='space-y-1 text-sm'>
            {settlement.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        )}
        <Button className='mt-3' onClick={exportText}>
          Export as Text
        </Button>
      </Card>
    </div>
  )
}
