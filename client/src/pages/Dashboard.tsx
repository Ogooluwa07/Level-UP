import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { fetchHabits, createHabit, updateHabit, deleteHabit, checkInHabit, fetchStats } from '../lib/habits'
import type { Habit } from '../lib/habits'
import { fetchLeaderboard } from '../lib/leaderboard'
import HabitCard from '../components/HabitCard'
import CreateHabitModal from '../components/CreateHabitModal'
import XPBar from '../components/XPBar'
import AchievementToast from '../components/AchievementToast'
import StatsPanel from '../components/StatsPanel'
import Leaderboard from '../components/Leaderboard'
import ThemeToggle from '../components/ThemeToggle'

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [newAchievements, setNewAchievements] = useState<any[]>([])
  const queryClient = useQueryClient()

  const { data: habits, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: fetchHabits,
  })

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  })

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
  })

  const createMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      setShowModal(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateHabit>[1] }) =>
      updateHabit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      setEditingHabit(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })

  const checkInMutation = useMutation({
    mutationFn: checkInHabit,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
      updateUser(data.user)
      if (data.newAchievements?.length > 0) {
        setNewAchievements(data.newAchievements)
      }
    },
  })

  function closeModal() {
    setShowModal(false)
    setEditingHabit(null)
  }

  return (
    <div className="min-h-screen bg-parchment-50 dark:bg-ink-950 text-ink-900 dark:text-parchment-50 p-6 max-w-2xl mx-auto transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold">
          Hey, <span className="text-violet-500 dark:text-violet-400">{user?.username}</span> 🎮
        </h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={logout}
            className="px-4 py-2 bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-100 dark:hover:bg-ink-700 rounded-lg text-sm transition active:scale-95"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="mb-6">
        <XPBar xp={user?.xp || 0} level={user?.level || 1} />
      </div>

      {stats && <StatsPanel stats={stats} />}

      {leaderboard && (
        <div className="mb-6 mt-6">
          <Leaderboard topUsers={leaderboard.topUsers} currentUserEntry={leaderboard.currentUserEntry} />
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-lg font-semibold">Your Habits</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-bold transition active:scale-95"
        >
          + New Habit
        </button>
      </div>

      {isLoading && <p className="text-ink-700/60 dark:text-parchment-200/60">Loading habits...</p>}

      {!isLoading && habits?.length === 0 && (
        <div className="bg-parchment-100 dark:bg-ink-900 rounded-xl p-8 text-center text-ink-700/60 dark:text-parchment-200/60">
          No habits yet. Create your first one to start earning XP!
        </div>
      )}

      <div className="space-y-3">
        {habits?.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onCheckIn={(id) => checkInMutation.mutate(id)}
            onDelete={(id) => deleteMutation.mutate(id)}
            onEdit={(habit) => setEditingHabit(habit)}
            checkingIn={checkInMutation.isPending}
          />
        ))}
      </div>

      {(showModal || editingHabit) && (
        <CreateHabitModal
          onClose={closeModal}
          onCreate={(data) => createMutation.mutate(data)}
          onUpdate={(id, data) => updateMutation.mutate({ id, data })}
          creating={createMutation.isPending || updateMutation.isPending}
          habitToEdit={editingHabit}
        />
      )}

      <AchievementToast achievements={newAchievements} onDismiss={() => setNewAchievements([])} />
    </div>
  )
}