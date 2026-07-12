import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-parchment-50 dark:bg-ink-950 text-ink-900 dark:text-parchment-50 transition-colors">
      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-5 max-w-6xl mx-auto">
        <h1 className="font-display text-xl font-bold flex items-center gap-2">
          <img src="/logo-full.png" alt="LevelUp logo" className="w-8 h-8" />
          <span>
            <span className="text-gold-500 dark:text-gold-400">Level</span>
            <span className="text-violet-500 dark:text-violet-400">Up</span>
          </span>
        </h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => navigate('/auth')}
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-semibold transition active:scale-95"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-6 pt-16 pb-20">
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Turn your habits into an
          <span className="text-violet-500 dark:text-violet-400"> RPG adventure</span> 🎮
        </h2>
        <p className="text-ink-700/70 dark:text-parchment-200/70 text-lg mb-8">
          Complete daily habits, earn XP, level up, and unlock achievements —
          LevelUp makes building good habits feel like playing your favorite game.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="px-8 py-3 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-ink-950 rounded-lg font-bold text-lg transition active:scale-95 shadow-lg"
        >
          Start Your Quest — It's Free
        </button>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h3 className="font-display text-2xl font-bold text-center mb-10">How it works</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-parchment-100 dark:bg-ink-900 rounded-xl p-6 text-center border-t-4 border-teal-400">
            <div className="text-3xl mb-3">📝</div>
            <h4 className="font-display font-semibold mb-2">1. Create habits</h4>
            <p className="text-ink-700/70 dark:text-parchment-200/70 text-sm">
              Add habits like "Drink water" or "Solve LeetCode," and set their difficulty.
            </p>
          </div>
          <div className="bg-parchment-100 dark:bg-ink-900 rounded-xl p-6 text-center border-t-4 border-gold-400">
            <div className="text-3xl mb-3">✅</div>
            <h4 className="font-display font-semibold mb-2">2. Check in daily</h4>
            <p className="text-ink-700/70 dark:text-parchment-200/70 text-sm">
              Mark habits done each day to build streaks and earn XP based on difficulty.
            </p>
          </div>
          <div className="bg-parchment-100 dark:bg-ink-900 rounded-xl p-6 text-center border-t-4 border-violet-500">
            <div className="text-3xl mb-3">🏆</div>
            <h4 className="font-display font-semibold mb-2">3. Level up</h4>
            <p className="text-ink-700/70 dark:text-parchment-200/70 text-sm">
              Watch your XP bar fill, unlock achievements, and climb the leaderboard.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-center text-ink-700/50 dark:text-parchment-200/40 text-sm pb-8">
        Built with React, TypeScript & Node.js
      </footer>
    </div>
  )
}