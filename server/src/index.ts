import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import habitRoutes from './routes/habit.routes'
import pushRoutes from './routes/push.routes'
import notificationRoutes from './routes/notification.routes'
import leaderboardRoutes from './routes/leaderboard.routes'

const app = express()

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : true // allow all in dev if not set

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ message: 'LevelUp API is running 🎮' })
})

app.use('/api/auth', authRoutes)
app.use('/api/habits', habitRoutes)
app.use('/api/push', pushRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

const PORT = process.env.PORT || 5000

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})