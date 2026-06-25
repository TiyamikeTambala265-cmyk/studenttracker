import { useState, useEffect } from 'react'
import { Task } from '../lib/storage'

type Props = {
  onSave: (t: Task) => void
  editing?: Task | null
  onCancel?: () => void
}

export default function TaskForm({ onSave, editing, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<'Low'|'Medium'|'High'>('Medium')

  useEffect(() => {
    if (editing) {
      setTitle(editing.title)
      setDescription(editing.description || '')
      setDueDate(editing.dueDate || '')
      setPriority(editing.priority)
    }
  }, [editing])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const now = new Date().toISOString()
    const task: Task = editing ? {
      ...editing,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
      priority,
    } : {
      id: String(Date.now()),
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
      priority,
      status: 'Pending',
      createdAt: now
    }
    onSave(task)
    if (!editing) {
      setTitle('')
      setDescription('')
      setDueDate('')
      setPriority('Medium')
    }
  }

  // Get today's date in YYYY-MM-DD format to prevent past dates
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-smooth hover:shadow-md">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{editing ? 'Edit Task' : 'Add New Task'}</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Task Title *</label>
        <input 
          type="text"
          value={title} 
          onChange={e=>setTitle(e.target.value)} 
          placeholder="Enter task title"
          className="w-full" 
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
        <textarea 
          value={description} 
          onChange={e=>setDescription(e.target.value)} 
          placeholder="Add any additional details (optional)"
          className="w-full h-24"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
          <input 
            type="date" 
            value={dueDate} 
            onChange={e=>setDueDate(e.target.value)} 
            min={today}
            className="w-full" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
          <select 
            value={priority} 
            onChange={e=>setPriority(e.target.value as any)} 
            className="w-full"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          type="submit"
          className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-smooth"
        >
          {editing ? 'Update Task' : 'Add Task'}
        </button>
        {editing && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="w-full sm:flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-smooth"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
