import { useQuery } from '@tanstack/react-query'
import { fetchStats } from '../lib/habits'
import { fetchLeaderboard } from '../lib/leaderboard'

export function useDashboardData() {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  })

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
  })

  return { stats, leaderboard }
}