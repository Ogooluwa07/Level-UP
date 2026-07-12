import { Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

export async function subscribe(req: AuthRequest, res: Response) {
  try {
    const { endpoint, keys } = req.body

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: 'Invalid subscription payload' })
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth, userId: req.userId as string },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: req.userId as string,
      },
    })

    res.status(201).json({ message: 'Subscribed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to subscribe' })
  }
}

export async function unsubscribe(req: AuthRequest, res: Response) {
  try {
    const { endpoint } = req.body
    await prisma.pushSubscription.deleteMany({ where: { endpoint, userId: req.userId } })
    res.json({ message: 'Unsubscribed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to unsubscribe' })
  }
}