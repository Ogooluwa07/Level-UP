import prisma from '../src/lib/prisma'

async function main() {
  console.log('🗑️  Clearing all user data...')

  const reminderLogs = await prisma.reminderLog.deleteMany()
  console.log(`   Deleted ${reminderLogs.count} reminder logs`)

  const users = await prisma.user.deleteMany()
  console.log(`   Deleted ${users.count} users (and all their habits, check-ins, achievements, push subscriptions via cascade)`)

  console.log('✅ Database is clean. Achievement definitions were preserved.')
}

main()
  .catch((err) => {
    console.error('❌ Reset failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })