import { Router } from 'express'
import { checkAndSendReminders } from '../controllers/notification.controller'

const router = Router()
router.get('/check', checkAndSendReminders)
router.post('/check', checkAndSendReminders)

export default router