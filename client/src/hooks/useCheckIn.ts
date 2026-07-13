import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { checkInHabit } from '../lib/habits'
import { useAuth } from '../context/AuthContext'

export function useCheckIn() {
  const { updateUser } = useAuth()
  const queryClient = useQueryClient()
  const [newAchievements, setNewAchievements] = useState<any[]>([])

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

  return {
    checkInMutation,
    newAchievements,
    clearAchievements: () => setNewAchievements([]),
  }
}