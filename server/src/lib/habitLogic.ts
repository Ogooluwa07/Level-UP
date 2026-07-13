export function calculateXpForCheckIn(
  xpReward: number,
  timesPerDay: number,
  isFinalCheckInOfDay: boolean
): number {
  const baseXp = Math.floor(xpReward / timesPerDay)
  return isFinalCheckInOfDay ? xpReward - baseXp * (timesPerDay - 1) : baseXp
}

export function calculateNewStreak(
  currentStreak: number,
  wasCheckedInYesterday: boolean
): number {
  return wasCheckedInYesterday ? currentStreak + 1 : 1
}

export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / 100) + 1
}