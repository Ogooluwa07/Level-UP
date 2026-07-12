import { Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

export async function getLeaderboard(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId as string

    const topUsers = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 20,
      select: {
        id: true,
        username: true,
        avatar: true,
        xp: true,
        level: true,
      },
    })

    const leaderboard = topUsers.map((u, index) => ({
      rank: index + 1,
      id: u.id,
      username: u.username,
      avatar: u.avatar,
      xp: u.xp,
      level: u.level,
      isCurrentUser: u.id === userId,
    }))

    const isUserInTop20 = leaderboard.some((entry) => entry.isCurrentUser)

    let currentUserEntry = null

    if (!isUserInTop20) {
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, avatar: true, xp: true, level: true },
      })

      if (currentUser) {
        const usersAhead = await prisma.user.count({
          where: { xp: { gt: currentUser.xp } },
        })

        currentUserEntry = {
          rank: usersAhead + 1,
          id: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          xp: currentUser.xp,
          level: currentUser.level,
          isCurrentUser: true,
        }
      }
    }

    res.json({
      topUsers: leaderboard,
      currentUserEntry,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
}