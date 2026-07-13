import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchHabits, createHabit, updateHabit, deleteHabit, checkInHabit } from '../lib/habits'
import type { Habit } from '../lib/habits'

export function useHabits() {
  const queryClient = useQueryClient()

  const { data: habits, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: fetchHabits,
  })

  const invalidateHabits = () => queryClient.invalidateQueries({ queryKey: ['habits'] })

  const createMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: invalidateHabits,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateHabit>[1] }) =>
      updateHabit(id, data),
    onSuccess: invalidateHabits,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteHabit,
    onSuccess: invalidateHabits,
  })

  return {
    habits,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}