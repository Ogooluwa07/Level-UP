import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { Stats } from '../lib/habits'
import { useTheme } from '../context/ThemeContext'
import HudPanel from './HudPanel'

interface Props {
  stats: Stats
}

export default function StatsPanel({ stats }: Props) {
  const { theme } = useTheme()
  const axisColor = theme === 'dark' ? '#9b82ff' : '#5b3de0'

  return (
    <HudPanel className="mb-6">
      <h2 className="font-display font-semibold text-lg mb-4 text-ink-900 dark:text-parchment-50">This Week</h2>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-parchment-50 dark:bg-ink-800 rounded-lg p-3 text-center">
          <p className="font-stat text-2xl font-bold text-gold-500 dark:text-gold-400">{stats.totalCheckIns}</p>
          <p className="text-xs text-ink-700/60 dark:text-parchment-200/60">Check-ins</p>
        </div>
        <div className="bg-parchment-50 dark:bg-ink-800 rounded-lg p-3 text-center">
          <p className="font-stat text-2xl font-bold text-crimson-500 dark:text-crimson-400">🔥{stats.longestStreak}</p>
          <p className="text-xs text-ink-700/60 dark:text-parchment-200/60">Best Streak</p>
        </div>
        <div className="bg-parchment-50 dark:bg-ink-800 rounded-lg p-3 text-center">
          <p className="font-stat text-2xl font-bold text-violet-500 dark:text-violet-400">{stats.totalHabits}</p>
          <p className="text-xs text-ink-700/60 dark:text-parchment-200/60">Active Habits</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={stats.weeklyStats}>
          <XAxis dataKey="day" stroke={axisColor} fontSize={12} />
          <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: theme === 'dark' ? '#1d1a3a' : '#ffffff',
              border: '1px solid #7c5cfc33',
              borderRadius: '8px',
            }}
            labelStyle={{ color: theme === 'dark' ? '#f7f2e7' : '#0b0a17' }}
          />
          <Bar dataKey="count" fill="#f0a83a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </HudPanel>
  )
}