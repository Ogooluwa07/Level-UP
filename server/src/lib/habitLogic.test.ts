import { describe, it, expect } from 'vitest'
import { calculateXpForCheckIn, calculateNewStreak, calculateLevel } from './habitLogic'

describe('calculateXpForCheckIn', () => {
  it('gives full XP for a habit checked in once per day', () => {
    expect(calculateXpForCheckIn(10, 1, true)).toBe(10)
  })

  it('splits XP evenly across a 2x/day habit with no remainder', () => {
    expect(calculateXpForCheckIn(10, 2, false)).toBe(5)
    expect(calculateXpForCheckIn(10, 2, true)).toBe(5)
  })

  it('gives the remainder to the final check-in when XP does not divide evenly', () => {
    // 10 XP / 3 times a day = 3, 3, 4 (not 3.33 x3)
    expect(calculateXpForCheckIn(10, 3, false)).toBe(3)
    expect(calculateXpForCheckIn(10, 3, true)).toBe(4)
  })

  it('always sums to exactly xpReward across all check-ins in a day', () => {
    const xpReward = 25
    const timesPerDay = 4
    let total = 0
    for (let i = 1; i <= timesPerDay; i++) {
      const isFinal = i === timesPerDay
      total += calculateXpForCheckIn(xpReward, timesPerDay, isFinal)
    }
    expect(total).toBe(xpReward)
  })
})

describe('calculateNewStreak', () => {
  it('increments the streak if checked in yesterday', () => {
    expect(calculateNewStreak(5, true)).toBe(6)
  })

  it('resets the streak to 1 if not checked in yesterday', () => {
    expect(calculateNewStreak(5, false)).toBe(1)
  })

  it('starts a brand new streak at 1', () => {
    expect(calculateNewStreak(0, false)).toBe(1)
  })
})

describe('calculateLevel', () => {
  it('starts at level 1 with 0 XP', () => {
    expect(calculateLevel(0)).toBe(1)
  })

  it('levels up every 100 XP', () => {
    expect(calculateLevel(99)).toBe(1)
    expect(calculateLevel(100)).toBe(2)
    expect(calculateLevel(250)).toBe(3)
  })
})