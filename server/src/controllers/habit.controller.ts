import { Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

async function checkAndAwardAchievements(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return []

  const habits = await prisma.habit.findMany({ where: { userId } })
  const maxStreak = Math.max(0, ...habits.map((h) => h.currentStreak))
  const habitCount = habits.length

  const alreadyUnlocked = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievement: { select: { name: true } } },
  })
  const unlockedNames = new Set(alreadyUnlocked.map((u) => u.achievement.name))

  const toUnlock: string[] = []

  const totalCheckIns = await prisma.checkIn.count({
    where: { habit: { userId } },
  })

  if (totalCheckIns >= 1 && !unlockedNames.has('First Steps')) toUnlock.push('First Steps')
  if (maxStreak >= 3 && !unlockedNames.has('3-Day Streak')) toUnlock.push('3-Day Streak')
  if (maxStreak >= 7 && !unlockedNames.has('7-Day Streak')) toUnlock.push('7-Day Streak')
  if (maxStreak >= 30 && !unlockedNames.has('30-Day Streak')) toUnlock.push('30-Day Streak')
  if (habitCount >= 5 && !unlockedNames.has('Habit Collector')) toUnlock.push('Habit Collector')
  if (user.xp >= 100 && !unlockedNames.has('100 XP Club')) toUnlock.push('100 XP Club')
  if (user.xp >= 500 && !unlockedNames.has('500 XP Club')) toUnlock.push('500 XP Club')
  if (user.xp >= 1000 && !unlockedNames.has('1000 XP Club')) toUnlock.push('1000 XP Club')
  if (user.level >= 5 && !unlockedNames.has('Level 5')) toUnlock.push('Level 5')
  if (user.level >= 10 && !unlockedNames.has('Level 10')) toUnlock.push('Level 10')

  if (toUnlock.length === 0) return []

  const achievementsToAward = await prisma.achievement.findMany({
    where: { name: { in: toUnlock } },
  })

  await prisma.userAchievement.createMany({
    data: achievementsToAward.map((a) => ({ userId, achievementId: a.id })),
    skipDuplicates: true,
  })

  return achievementsToAward
}

// Helper: get YYYY-MM-DD using LOCAL date parts, not UTC
function toLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// GET all habits for the logged-in user
export async function getHabits(req: AuthRequest, res: Response) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const habits = await prisma.habit.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        checkIns: {
          where: { date: { gte: today, lt: tomorrow } },
        },
      },
    })

    const habitsWithStatus = habits.map((habit) => ({
      ...habit,
      checkedInToday: habit.checkIns.length > 0,
      checkIns: undefined,
    }))

    res.json(habitsWithStatus)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch habits' })
  }
}

// CREATE a new habit
export async function createHabit(req: AuthRequest, res: Response) {
  try {
    const { title, category, difficulty, frequency } = req.body

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' })
    }

    const xpMap: Record<string, number> = { EASY: 10, MEDIUM: 25, HARD: 50 }
    const xpReward = xpMap[difficulty] || 10

    const habit = await prisma.habit.create({
      data: {
        title,
        category,
        difficulty: difficulty || 'EASY',
        frequency: frequency || 'DAILY',
        xpReward,
        userId: req.userId as string,
      },
    })

    res.status(201).json(habit)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create habit' })
  }
}

// UPDATE a habit
export async function updateHabit(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string
    const { title, category, difficulty, frequency } = req.body

    const habit = await prisma.habit.findUnique({ where: { id } })

    if (!habit || habit.userId !== req.userId) {
      return res.status(404).json({ error: 'Habit not found' })
    }

    const xpMap: Record<string, number> = { EASY: 10, MEDIUM: 25, HARD: 50 }

    const updated = await prisma.habit.update({
      where: { id },
      data: {
        title: title ?? habit.title,
        category: category ?? habit.category,
        difficulty: difficulty ?? habit.difficulty,
        frequency: frequency ?? habit.frequency,
        xpReward: difficulty ? xpMap[difficulty] : habit.xpReward,
      },
    })

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update habit' })
  }
}

// DELETE a habit
export async function deleteHabit(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string

    const habit = await prisma.habit.findUnique({ where: { id } })

    if (!habit || habit.userId !== req.userId) {
      return res.status(404).json({ error: 'Habit not found' })
    }

    await prisma.habit.delete({ where: { id } })

    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete habit' })
  }
}

// CHECK IN a habit (mark as done today)
export async function checkInHabit(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string

    const habit = await prisma.habit.findUnique({ where: { id } })

    if (!habit || habit.userId !== req.userId) {
      return res.status(404).json({ error: 'Habit not found' })
    }

    // Prevent double check-in on the same day
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingCheckIn = await prisma.checkIn.findFirst({
      where: {
        habitId: id,
        date: { gte: today, lt: tomorrow },
      },
    })

    if (existingCheckIn) {
      return res.status(409).json({ error: 'Already checked in today' })
    }

    // Check if yesterday was checked in, to know if streak continues or resets
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const yesterdayCheckIn = await prisma.checkIn.findFirst({
      where: {
        habitId: id,
        date: { gte: yesterday, lt: today },
      },
    })

    const newStreak = yesterdayCheckIn ? habit.currentStreak + 1 : 1
    const newLongestStreak = Math.max(newStreak, habit.longestStreak)

    // Create the check-in and update streak + user XP in one transaction
    const [checkIn, updatedHabit, updatedUser] = await prisma.$transaction([
      prisma.checkIn.create({ data: { habitId: id } }),
      prisma.habit.update({
        where: { id },
        data: { currentStreak: newStreak, longestStreak: newLongestStreak },
      }),
      prisma.user.update({
        where: { id: req.userId },
        data: { xp: { increment: habit.xpReward } },
      }),
    ])

    // Calculate level from total XP (every 100 XP = 1 level, simple formula for now)
    const newLevel = Math.floor(updatedUser.xp / 100) + 1
    let finalUser = updatedUser

    if (newLevel !== updatedUser.level) {
      finalUser = await prisma.user.update({
        where: { id: req.userId },
        data: { level: newLevel },
      })
    }

    const newAchievements = await checkAndAwardAchievements(req.userId as string)

    res.json({
      checkIn,
      habit: updatedHabit,
      user: {
        id: finalUser.id,
        email: finalUser.email,
        username: finalUser.username,
        level: finalUser.level,
        xp: finalUser.xp,
      },
      leveledUp: newLevel > updatedUser.level - (newLevel !== updatedUser.level ? 1 : 0) && newLevel !== updatedUser.level,
      newAchievements,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to check in habit' })
  }
}

// GET user's unlocked achievements
export async function getUserAchievements(req: AuthRequest, res: Response) {
  try {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: req.userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
    })
    res.json(userAchievements)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch achievements' })
  }
}

// GET check-in stats for the last 7 days
export async function getStats(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId as string

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const checkIns = await prisma.checkIn.findMany({
      where: {
        habit: { userId },
        date: { gte: sevenDaysAgo },
      },
      select: { date: true },
    })

    // Build a map of the last 7 days, initialized to 0 (using LOCAL date keys)
    const dayCounts: Record<string, number> = {}
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo)
      d.setDate(d.getDate() + i)
      dayCounts[toLocalDateKey(d)] = 0
    }

    checkIns.forEach((c) => {
      const key = toLocalDateKey(c.date)
      if (dayCounts[key] !== undefined) dayCounts[key]++
    })

    const stats = Object.entries(dayCounts).map(([date, count]) => ({
      date,
      day: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      count,
    }))

    const totalCheckIns = await prisma.checkIn.count({ where: { habit: { userId } } })
    const habits = await prisma.habit.findMany({ where: { userId } })
    const longestStreak = Math.max(0, ...habits.map((h) => h.longestStreak))

    res.json({ weeklyStats: stats, totalCheckIns, longestStreak, totalHabits: habits.length })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
}