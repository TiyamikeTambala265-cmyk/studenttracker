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
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Task Dashboard</h1>
          <p className="text-slate-600">Manage your assignments and track deadlines</p>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-smooth">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-smooth">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{completed}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-smooth">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{pending}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-smooth">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Overdue</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{overdue}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2m-6-4a6 6 0 1112 0 6 6 0 01-12 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="grid lg:grid-cols-3 gap-8">
          {/* Form Sidebar */}
          <div className="lg:col-span-1">
            <TaskForm onSave={addOrUpdate} editing={editing} onCancel={()=>setEditing(null)} />
          </div>

          {/* Task List */}
          <div className="lg:col-span-2">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(['All', 'Pending', 'Completed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-smooth ${
                    filter === f
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Task List */}
            <TaskList tasks={visible} onToggle={toggle} onEdit={(t)=>setEditing(t)} onDelete={remove} />
          </div>
        </section>
      </div>
    </main>
  )
}
