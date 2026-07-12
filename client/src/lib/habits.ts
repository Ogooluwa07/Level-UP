import api from './api'

export interface Habit {
  id: string
  title: string
  category: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  timeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'ANYTIME'
  timesPerDay: number
  xpReward: number
  currentStreak: number
  longestStreak: number
  createdAt: string
  checkedInToday: boolean
  todayProgress: number
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
  timeOfDay: string
  timesPerDay: number
}): Promise<Habit> {
  const res = await api.post('/habits', data)
  return res.data
}

export async function updateHabit(
  id: string,
  data: {
    title: string
    category: string
    difficulty: string
    frequency: string
    timeOfDay: string
    timesPerDay: number
  }
): Promise<Habit> {
  const res = await api.put(`/habits/${id}`, data)
  return res.data
}

export async function deleteHabit(id: string): Promise<void> {
  await api.delete(`/habits/${id}`)
}

export interface CheckInResponse {
  checkIn: {
    id: string
    date: string
    habitId: string
  }
  habit: Habit
  user: {
    id: string
    email: string
    username: string
    level: number
    xp: number
  }
  leveledUp: boolean
  newAchievements: {
    id: string
    name: string
    description: string
    icon: string
  }[]
  isFullyCompleted: boolean
  todayProgress: number
  timesPerDay: number
}

export async function checkInHabit(id: string): Promise<CheckInResponse> {
  const res = await api.post(`/habits/${id}/checkin`)
  return res.data
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