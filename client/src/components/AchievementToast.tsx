interface Achievement {
  id: string
  name: string
  description: string
  icon: string
}

interface Props {
  achievements: Achievement[]
  onDismiss: () => void
}

export default function AchievementToast({ achievements, onDismiss }: Props) {
  if (achievements.length === 0) return null

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      {achievements.map((a) => (
        <div
          key={a.id}
          className="bg-gradient-to-r from-violet-500 to-gold-400 text-ink-950 rounded-lg p-4 shadow-2xl flex items-center gap-3 max-w-xs"
        >
          <div className="text-3xl">{a.icon}</div>
          <div>
            <p className="font-display font-bold text-sm">Achievement Unlocked!</p>
            <p className="font-stat text-sm font-semibold">{a.name}</p>
            <p className="text-xs opacity-80">{a.description}</p>
          </div>
          <button onClick={onDismiss} className="ml-auto text-ink-950/50 hover:text-ink-950">
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}