import { Link } from 'react-router-dom'
import type { LeaderboardResponse } from '../lib/leaderboard'

interface Props {
  leaderboard: LeaderboardResponse
}

export default function LeaderboardTeaser({ leaderboard }: Props) {
  const topEntry = leaderboard.topUsers[0]

  if (!topEntry) return null

  return (
    <Link
      to="/leaderboard"
      className="block bg-parchment-100 dark:bg-ink-900 rounded-xl p-4 hover:shadow-md transition group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="font-display font-semibold text-ink-900 dark:text-parchment-50">
              {topEntry.username} is #1
            </p>
            <p className="text-sm text-ink-700/60 dark:text-parchment-200/60 font-stat">
              {topEntry.xp} XP · Lvl {topEntry.level}
            </p>
          </div>
        </div>
        <span className="text-sm text-violet-500 dark:text-violet-300 font-semibold group-hover:translate-x-1 transition-transform">
          View full leaderboard →
        </span>
      </div>
    </Link>
  )
}