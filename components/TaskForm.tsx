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

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow">
      <div className="mb-2">
        <label className="block text-sm font-medium">Title</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full border rounded p-2" />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} className="mt-1 w-full border rounded p-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="mt-1 w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Priority</label>
          <select value={priority} onChange={e=>setPriority(e.target.value as any)} className="mt-1 w-full border rounded p-2">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button className="w-full sm:w-auto bg-blue-600 text-white px-3 py-2 rounded">{editing ? 'Update' : 'Add'}</button>
        {editing && <button type="button" onClick={onCancel} className="w-full sm:w-auto px-3 py-2 rounded border">Cancel</button>}
      </div>
    </form>
  )
}
