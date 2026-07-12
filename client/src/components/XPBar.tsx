import HudPanel from './HudPanel'

interface Props {
  xp: number
  level: number
}

export default function XPBar({ xp, level }: Props) {
  const xpIntoLevel = xp % 100

  return (
    <HudPanel>
      <div className="flex justify-between items-baseline mb-3">
        <span className="font-display font-bold text-lg text-ink-900 dark:text-parchment-50">
          Level <span className="font-stat text-violet-500 dark:text-violet-400">{level}</span>
        </span>
        <span className="font-stat text-sm text-ink-700 dark:text-parchment-200/70">
          {xpIntoLevel}<span className="opacity-50">/100</span> XP
        </span>
      </div>
      <div className="w-full h-2.5 bg-parchment-200 dark:bg-ink-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-gold-400 transition-all duration-500"
          style={{ width: `${xpIntoLevel}%` }}
        />
      </div>
    </HudPanel>
  )
}