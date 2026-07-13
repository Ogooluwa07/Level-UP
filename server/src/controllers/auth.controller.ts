import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import { registerSchema, loginSchema } from '../lib/schemas'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function register(req: Request, res: Response) {
  try {
    const parsed = registerSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message })
    }

    const { email, username, password } = parsed.data

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })

    if (existingUser) {
      return res.status(409).json({ error: 'Email or username already in use' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { email, username, passwordHash },
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, username: user.username, level: user.level, xp: user.xp },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong during registration' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message })
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username, level: user.level, xp: user.xp },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong during login' })
  }
}