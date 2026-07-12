import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import webpush from '../lib/webpush'

const REMINDER_OFFSETS = [180, 60, 30, 15, 5] // minutes before midnight

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function checkAndSendReminders(req: Request, res: Response) {
  const secret = req.query.secret || req.headers['x-cron-secret']
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const minutesUntilMidnight = Math.round((midnight.getTime() - now.getTime()) / 60000)

    const matchedOffset = REMINDER_OFFSETS.find(
      (o) => minutesUntilMidnight <= o && minutesUntilMidnight > o - 5
    )

    if (!matchedOffset) {
      return res.json({ message: 'No reminder window right now', minutesUntilMidnight })
    }

    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const dateKey = toLocalDateKey(now)

    const habits = await prisma.habit.findMany({
      where: { checkIns: { none: { date: { gte: todayStart } } } },
      include: { user: { include: { pushSubscriptions: true } } },
    })

    let sent = 0

    for (const habit of habits) {
      if (habit.user.pushSubscriptions.length === 0) continue

      const alreadySent = await prisma.reminderLog
        .findUnique({
          where: {
            habitId_dateKey_offsetMinutes: {
              habitId: habit.id,
              dateKey,
              offsetMinutes: matchedOffset,
            },
          },
        })
        .catch(() => null)

      if (alreadySent) continue

      const label =
        matchedOffset >= 60
          ? `${matchedOffset / 60} hour${matchedOffset > 60 ? 's' : ''}`
          : `${matchedOffset} minutes`

      const payload = JSON.stringify({
        title: '⏰ Streak Alert!',
        body: `${label} left to check in "${habit.title}" and keep your streak 🔥`,
        url: '/dashboard',
      })

      for (const sub of habit.user.pushSubscriptions) {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          )
          sent++
        } catch (err: any) {
          if (err.statusCode === 404 || err.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
          } else {
            console.error('Push send failed:', err.message)
          }
        }
      }

      await prisma.reminderLog
        .create({ data: { habitId: habit.id, dateKey, offsetMinutes: matchedOffset } })
        .catch(() => {})
    }

    res.json({ message: 'Reminders processed', offset: matchedOffset, sent })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to process reminders' })
  }
}