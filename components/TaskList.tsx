import { Task } from '../lib/storage'
import { format } from 'date-fns'

type Props = {
  tasks: Task[]
  onToggle: (id: string) => void
  onEdit: (t: Task) => void
  onDelete: (id: string) => void
}

export default function TaskList({ tasks, onToggle, onEdit, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-slate-400 mb-2">
          <svg className="w-12 h-12 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">No tasks yet</p>
        <p className="text-slate-400 text-sm mt-1">Add a task to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map(t => (
        <div 
          key={t.id} 
          className={`bg-white p-5 rounded-xl border transition-smooth group hover:shadow-md ${
            t.status === 'Completed' 
              ? 'border-slate-200 opacity-75' 
              : 'border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex gap-4">
            {/* Checkbox */}
            <div className="flex-shrink-0 pt-1">
              <input 
                type="checkbox" 
                checked={t.status === 'Completed'} 
                onChange={() => onToggle(t.id)}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 cursor-pointer transition-smooth focus-ring"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 
                  className={`text-base font-semibold break-words ${
                    t.status === 'Completed' 
                      ? 'line-through text-slate-400' 
                      : 'text-slate-900'
                  }`}
                >
                  {t.title}
                </h3>

                {/* Priority Badge */}
                <span 
                  className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                    t.priority === 'High' 
                      ? 'bg-red-100 text-red-700' 
                      : t.priority === 'Medium' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {t.priority} Priority
                </span>

                {/* Overdue Badge */}
                {t.dueDate && new Date(t.dueDate) < new Date() && t.status === 'Pending' ? (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700 whitespace-nowrap">
                    Overdue
                  </span>
                ) : null}
              </div>

              {/* Description */}
              {t.description && (
                <p className="text-sm text-slate-600 mb-3 break-words">{t.description}</p>
              )}

              {/* Due Date */}
              {t.dueDate && (
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Due {format(new Date(t.dueDate), 'MMM d, yyyy')}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
              <button 
                onClick={() => onEdit(t)} 
                className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-smooth font-medium"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(t.id)} 
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-smooth font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
