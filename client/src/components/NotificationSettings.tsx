import { useState, useEffect } from 'react'
import { subscribeToPush, unsubscribeFromPush } from '../lib/push'

export default function NotificationSettings() {
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    navigator.serviceWorker?.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription()
      setSubscribed(!!sub)
    })
  }, [])

  async function handleToggle() {
    setLoading(true)
    try {
      if (subscribed) {
        await unsubscribeFromPush()
        setSubscribed(false)
      } else {
        await subscribeToPush()
        setSubscribed(true)
      }
    } catch (err: any) {
      alert(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-2 rounded-lg text-sm font-semibold transition active:scale-95 ${
        subscribed
          ? 'bg-teal-500 hover:bg-teal-600 text-white'
          : 'bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-100 dark:hover:bg-ink-700'
      }`}
    >
      {loading ? '...' : subscribed ? '🔔 On' : '🔕 Reminders'}
    </button>
  )
}