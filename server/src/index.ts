import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import habitRoutes from './routes/habit.routes'
import pushRoutes from './routes/push.routes'
import notificationRoutes from './routes/notification.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ message: 'LevelUp API is running 🎮' })
})

app.use('/api/auth', authRoutes)
app.use('/api/habits', habitRoutes)
app.use('/api/push', pushRoutes)
app.use('/api/notifications', notificationRoutes)
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})