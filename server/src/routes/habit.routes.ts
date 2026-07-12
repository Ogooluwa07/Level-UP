import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { getHabits, createHabit, updateHabit, deleteHabit, checkInHabit, getUserAchievements, getStats } from '../controllers/habit.controller'

const router = Router()

router.use(requireAuth)

router.get('/', getHabits)
router.post('/', createHabit)
router.put('/:id', updateHabit)
router.delete('/:id', deleteHabit)
router.post('/:id/checkin', checkInHabit)
router.get('/achievements/me', getUserAchievements)
router.get('/stats/me', getStats)

export default router