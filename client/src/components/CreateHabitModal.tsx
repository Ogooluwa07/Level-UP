import { useState } from 'react'
import type { FormEvent } from 'react'

interface Props {
  onClose: () => void
  onCreate: (data: { title: string; category: string; difficulty: string; frequency: string }) => void
  creating: boolean
}

export default function CreateHabitModal({ onClose, onCreate, creating }: Props) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Health')
  const [difficulty, setDifficulty] = useState('EASY')
  const [frequency, setFrequency] = useState('DAILY')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onCreate({ title, category, difficulty, frequency })
  }

  const inputClass =
    'w-full px-4 py-2 rounded-lg bg-parchment-50 dark:bg-ink-800 text-ink-900 dark:text-parchment-50 placeholder-ink-700/40 dark:placeholder-parchment-200/40 border border-parchment-200 dark:border-ink-700 outline-none focus:ring-2 focus:ring-violet-500'

  return (
    <div className="fixed inset-0 bg-ink-950/60 flex items-center justify-center px-4 z-50">
      <div className="bg-parchment-100 dark:bg-ink-900 text-ink-900 dark:text-parchment-50 rounded-2xl p-6 w-full max-w-sm">
        <h2 className="font-display text-xl font-bold mb-4">New Habit</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Habit title (e.g. Drink water)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            <option>Health</option>
            <option>Fitness</option>
            <option>Study</option>
            <option>Finance</option>
            <option>Coding</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={inputClass}>
              <option value="EASY">Easy · 10 XP</option>
              <option value="MEDIUM">Medium · 25 XP</option>
              <option value="HARD">Hard · 50 XP</option>
            </select>

            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={inputClass}>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-parchment-200 dark:bg-ink-700 hover:bg-parchment-50 dark:hover:bg-ink-800 font-semibold transition active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50 font-semibold transition active:scale-95"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}