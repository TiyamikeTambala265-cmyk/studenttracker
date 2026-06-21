import { Task } from '../lib/storage'
import { format } from 'date-fns'

type Props = {
  tasks: Task[]
  onToggle: (id: string) => void
  onEdit: (t: Task) => void
  onDelete: (id: string) => void
}

export default function TaskList({ tasks, onToggle, onEdit, onDelete }: Props) {
  if (tasks.length === 0) return <div className="text-center p-6 text-gray-500">No tasks</div>

  return (
    <ul className="space-y-2">
      {tasks.map(t => (
        <li key={t.id} className="bg-white p-3 rounded shadow flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <input className="mt-1" type="checkbox" checked={t.status==='Completed'} onChange={()=>onToggle(t.id)} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`text-lg font-medium ${t.status==='Completed'? 'line-through text-gray-400':''}`}>{t.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${t.priority==='High' ? 'bg-red-100 text-red-800' : t.priority==='Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{t.priority}</span>
                  {t.dueDate && new Date(t.dueDate) < new Date() && t.status==='Pending' ? (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Overdue</span>
                  ) : null}
                </div>
                {t.description ? <p className="text-sm text-gray-600 mt-1">{t.description}</p> : null}
                <div className="text-xs text-gray-500 mt-1">{t.dueDate ? `Due ${format(new Date(t.dueDate), 'MMM d, yyyy')}` : ''}</div>
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-0 flex gap-2 sm:flex-col">
            <button onClick={()=>onEdit(t)} className="text-sm text-blue-600">Edit</button>
            <button onClick={()=>onDelete(t.id)} className="text-sm text-red-600">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
