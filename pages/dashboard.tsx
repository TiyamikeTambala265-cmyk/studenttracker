import { useEffect, useState } from 'react'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { loadTasks, saveTasks, Task } from '../lib/storage'

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'All'|'Pending'|'Completed'>('All')
  const [editing, setEditing] = useState<Task | null>(null)

  useEffect(()=>{
    setTasks(loadTasks())
  }, [])

  useEffect(()=>{
    if (typeof window !== 'undefined') {
      const f = localStorage.getItem('mini_filter') as 'All'|'Pending'|'Completed' | null
      if (f) setFilter(f)
    }
  }, [])

  useEffect(()=>{
    saveTasks(tasks)
  }, [tasks])

  useEffect(()=>{
    if (typeof window !== 'undefined') localStorage.setItem('mini_filter', filter)
  }, [filter])

  function addOrUpdate(t: Task) {
    setTasks(prev => {
      const exists = prev.find(p=>p.id===t.id)
      if (exists) return prev.map(p=>p.id===t.id? t: p)
      return [t, ...prev]
    })
    setEditing(null)
  }

  function toggle(id: string) {
    setTasks(prev => prev.map(p=> p.id===id ? {...p, status: p.status==='Pending'?'Completed':'Pending'} : p))
  }

  function remove(id: string) {
    setTasks(prev => prev.filter(p=>p.id!==id))
  }

  const total = tasks.length
  const completed = tasks.filter(t=>t.status==='Completed').length
  const pending = tasks.filter(t=>t.status==='Pending').length
  const overdue = tasks.filter(t=>t.dueDate && new Date(t.dueDate) < new Date() && t.status==='Pending').length

  const visible = tasks
    .filter(t=> filter==='All' ? true : t.status===filter)
    .sort((a,b)=>{
      if (!a.dueDate && !b.dueDate) return b.createdAt.localeCompare(a.createdAt)
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="text-sm text-gray-600">Summary of your tasks</div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Total Tasks</div>
            <div className="text-xl font-semibold">{total}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-xl font-semibold">{completed}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-xl font-semibold">{pending}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Overdue</div>
            <div className="text-xl font-semibold text-red-600">{overdue}</div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <TaskForm onSave={addOrUpdate} editing={editing} onCancel={()=>setEditing(null)} />
          </div>

          <div className="md:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-2">
                <button onClick={()=>setFilter('All')} className={`px-3 py-1 rounded ${filter==='All' ? 'bg-blue-600 text-white' : 'bg-white'}`}>All</button>
                <button onClick={()=>setFilter('Pending')} className={`px-3 py-1 rounded ${filter==='Pending' ? 'bg-blue-600 text-white' : 'bg-white'}`}>Pending</button>
                <button onClick={()=>setFilter('Completed')} className={`px-3 py-1 rounded ${filter==='Completed' ? 'bg-blue-600 text-white' : 'bg-white'}`}>Completed</button>
              </div>
            </div>

            <TaskList tasks={visible} onToggle={toggle} onEdit={(t)=>setEditing(t)} onDelete={remove} />
          </div>
        </section>
      </div>
    </main>
  )
}
