import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { subscribe, unsubscribe } from '../controllers/push.controller'

const router = Router()

router.use(requireAuth)
router.post('/subscribe', subscribe)
router.post('/unsubscribe', unsubscribe)

export default router