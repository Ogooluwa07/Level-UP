import type { Habit } from '../lib/habits'

interface Props {
  habit: Habit
  onCheckIn: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (habit: Habit) => void
  checkingIn: boolean
}

const difficultyStyles = {
  EASY: 'bg-teal-400/15 text-teal-500 dark:text-teal-300',
  MEDIUM: 'bg-gold-400/15 text-gold-500 dark:text-gold-300',
  HARD: 'bg-crimson-500/15 text-crimson-500 dark:text-crimson-400',
}

const categoryAccents: Record<string, string> = {
  Health: 'border-teal-400',
  Fitness: 'border-crimson-500',
  Study: 'border-violet-500',
  Finance: 'border-gold-400',
  Coding: 'border-violet-400',
}

const timeOfDayIcons: Record<string, string> = {
  MORNING: '🌅',
  AFTERNOON: '☀️',
  EVENING: '🌙',
  ANYTIME: '',
}

const timeOfDayLabels: Record<string, string> = {
  MORNING: 'Morning',
  AFTERNOON: 'Afternoon',
  EVENING: 'Evening',
  ANYTIME: 'Anytime',
}

export default function HabitCard({ habit, onCheckIn, onDelete, onEdit, checkingIn }: Props) {
  const accentBorder = categoryAccents[habit.category] || 'border-violet-500'
  const isHotStreak = habit.currentStreak >= 7
  const showTimeOfDay = habit.timeOfDay !== 'ANYTIME'
  const showProgress = habit.timesPerDay > 1

  return (
    <div className={`bg-parchment-100 dark:bg-ink-900 rounded-lg p-4 flex items-center justify-between border-l-4 ${accentBorder} transition hover:shadow-md`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display font-semibold text-ink-900 dark:text-parchment-50">{habit.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyStyles[habit.difficulty]}`}>
            {habit.difficulty}
          </span>
          {showTimeOfDay && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-violet-400/15 text-violet-500 dark:text-violet-300">
              {timeOfDayIcons[habit.timeOfDay]} {timeOfDayLabels[habit.timeOfDay]}
            </span>
          )}
        </div>
        <p className="text-ink-700/70 dark:text-parchment-200/60 text-sm flex items-center gap-2">
          <span>{habit.category}</span>
          <span className="opacity-40">·</span>
          <span className="font-stat text-gold-500 dark:text-gold-400">+{habit.xpReward} XP</span>
          {showProgress && (
            <>
              <span className="opacity-40">·</span>
              <span className="font-stat text-violet-500 dark:text-violet-300">
                {habit.todayProgress}/{habit.timesPerDay} today
              </span>
            </>
          )}
          {habit.currentStreak > 0 && (
            <span
              className={`font-stat flex items-center gap-1 ${
                isHotStreak
                  ? 'bg-gradient-to-r from-gold-400 to-crimson-500 bg-clip-text text-transparent font-bold'
                  : 'text-gold-500 dark:text-gold-400'
              }`}
            >
              🔥{habit.currentStreak}
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onCheckIn(habit.id)}
          disabled={checkingIn || habit.checkedInToday}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95 ${
            habit.checkedInToday
              ? 'bg-parchment-200 dark:bg-ink-700 text-ink-700/50 dark:text-parchment-200/40 cursor-not-allowed'
              : 'bg-teal-500 hover:bg-teal-400 text-white shadow-sm hover:shadow-md disabled:opacity-50'
          }`}
        >
          {habit.checkedInToday
            ? '✓ Done'
            : showProgress
            ? `Check In (${habit.todayProgress}/${habit.timesPerDay})`
            : 'Check In'}
        </button>
        <button
          onClick={() => onEdit(habit)}
          className="px-3 py-2 bg-parchment-200 dark:bg-ink-700 hover:bg-violet-500/15 hover:text-violet-500 rounded-lg text-sm text-ink-700/50 dark:text-parchment-200/40 transition"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(habit.id)}
          className="px-3 py-2 bg-parchment-200 dark:bg-ink-700 hover:bg-crimson-500/15 hover:text-crimson-500 rounded-lg text-sm text-ink-700/50 dark:text-parchment-200/40 transition"
        >
          🗑
        </button>
      </div>
    </div>
  )
}