import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const achievements = [
  { name: 'First Steps', description: 'Complete your first habit', icon: '🏅' },
  { name: '3-Day Streak', description: 'Maintain a 3-day streak on any habit', icon: '🔥' },
  { name: '7-Day Streak', description: 'Maintain a 7-day streak on any habit', icon: '🔥' },
  { name: '30-Day Streak', description: 'Maintain a 30-day streak on any habit', icon: '🔥' },
  { name: 'Habit Collector', description: 'Create 5 different habits', icon: '📝' },
  { name: '100 XP Club', description: 'Earn a total of 100 XP', icon: '⭐' },
  { name: '500 XP Club', description: 'Earn a total of 500 XP', icon: '⭐' },
  { name: '1000 XP Club', description: 'Earn a total of 1000 XP', icon: '💯' },
  { name: 'Level 5', description: 'Reach level 5', icon: '🚀' },
  { name: 'Level 10', description: 'Reach level 10', icon: '👑' },
]

async function main() {
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement,
    })
  }
  console.log(`Seeded ${achievements.length} achievements`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })