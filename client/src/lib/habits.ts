import api from './api'

export interface Habit {
  id: string
  title: string
  category: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  xpReward: number
  currentStreak: number
  longestStreak: number
  createdAt: string
}

export async function fetchHabits(): Promise<Habit[]> {
  const res = await api.get('/habits')
  return res.data
}

export async function createHabit(data: {
  title: string
  category: string
  difficulty: string
  frequency: string
}): Promise<Habit> {
  const res = await api.post('/habits', data)
  return res.data
}

export async function deleteHabit(id: string): Promise<void> {
  await api.delete(`/habits/${id}`)
}

export async function checkInHabit(id: string) {
  const res = await api.post(`/habits/${id}/checkin`)
  return res.data
}

export interface Habit {
  id: string
  title: string
  category: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  xpReward: number
  currentStreak: number
  longestStreak: number
  createdAt: string
  checkedInToday: boolean
}
export interface WeeklyStat {
  date: string
  day: string
  count: number
}

export interface Stats {
  weeklyStats: WeeklyStat[]
  totalCheckIns: number
  longestStreak: number
  totalHabits: number
}

export async function fetchStats(): Promise<Stats> {
  const res = await api.get('/habits/stats/me')
  return res.data
}