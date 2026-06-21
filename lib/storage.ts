export type Task = {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Pending' | 'Completed'
  createdAt: string
}

const KEY = 'mini_tasks_v1'

export function loadTasks(): Task[] {
  try {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as Task[]
  } catch (e) {
    return []
  }
}

export function saveTasks(tasks: Task[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(tasks))
}
