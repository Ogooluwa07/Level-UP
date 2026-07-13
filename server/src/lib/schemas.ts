import { z } from 'zod'

export const createHabitSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title is too long'),
  category: z.string().trim().min(1, 'Category is required'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional().default('EASY'),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional().default('DAILY'),
  timeOfDay: z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME']).optional().default('ANYTIME'),
  timesPerDay: z.number().int().positive().max(10).optional().default(1),
})

export const updateHabitSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  category: z.string().trim().min(1).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
  timeOfDay: z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME']).optional(),
  timesPerDay: z.number().int().positive().max(10).optional(),
})

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be under 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})