import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchLeaderboard } from '../lib/leaderboard'
import Leaderboard from '../components/Leaderboard'
import ThemeToggle from '../components/ThemeToggle'

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
  })

  return (
    <div className="min-h-screen bg-parchment-50 dark:bg-ink-950 text-ink-900 dark:text-parchment-50 p-6 max-w-2xl mx-auto transition-colors">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-ink-700/70 dark:text-parchment-200/60 hover:text-violet-500 dark:hover:text-violet-300 transition"
        >
          ← Back to Dashboard
        </Link>
        <ThemeToggle />
      </div>

      <h1 className="font-display text-2xl font-bold mb-6">🏆 Leaderboard</h1>

      {isLoading && <p className="text-ink-700/60 dark:text-parchment-200/60">Loading rankings...</p>}

      {leaderboard && (
        <Leaderboard topUsers={leaderboard.topUsers} currentUserEntry={leaderboard.currentUserEntry} />
      )}
    </div>
  )
}