import type { LeaderboardEntry } from '../lib/leaderboard'

interface Props {
  topUsers: LeaderboardEntry[]
  currentUserEntry: LeaderboardEntry | null
}

const rankMedal: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-lg transition ${
        entry.isCurrentUser
          ? 'bg-violet-500/15 border border-violet-500/40'
          : 'hover:bg-parchment-50 dark:hover:bg-ink-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="font-stat w-8 text-center text-ink-700/70 dark:text-parchment-200/60">
          {rankMedal[entry.rank] || `#${entry.rank}`}
        </span>
        <span className="font-semibold text-ink-900 dark:text-parchment-50">
          {entry.username}
          {entry.isCurrentUser && (
            <span className="ml-2 text-xs text-violet-500 dark:text-violet-300 font-medium">(You)</span>
          )}
        </span>
      </div>
      <div className="flex items-center gap-3 font-stat text-sm">
        <span className="text-ink-700/60 dark:text-parchment-200/50">Lvl {entry.level}</span>
        <span className="text-gold-500 dark:text-gold-400 font-bold">{entry.xp} XP</span>
      </div>
    </div>
  )
}

export default function Leaderboard({ topUsers, currentUserEntry }: Props) {
  return (
    <div className="bg-parchment-100 dark:bg-ink-900 rounded-xl p-4">
      <h2 className="font-display text-lg font-semibold mb-3">🏆 Leaderboard</h2>

      {topUsers.length === 0 ? (
        <p className="text-ink-700/60 dark:text-parchment-200/60 text-sm">No rankings yet.</p>
      ) : (
        <div className="space-y-1">
          {topUsers.map((entry) => (
            <LeaderboardRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {currentUserEntry && (
        <>
          <div className="border-t border-parchment-200 dark:border-ink-700 my-2" />
          <LeaderboardRow entry={currentUserEntry} />
        </>
      )}
    </div>
  )
}