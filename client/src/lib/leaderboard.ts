import api from './api'

export interface LeaderboardEntry {
  rank: number
  id: string
  username: string
  avatar: string | null
  xp: number
  level: number
  isCurrentUser: boolean
}

export interface LeaderboardResponse {
  topUsers: LeaderboardEntry[]
  currentUserEntry: LeaderboardEntry | null
}

export async function fetchLeaderboard(): Promise<LeaderboardResponse> {
  const res = await api.get('/leaderboard')
  return res.data
}