import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'

export default function UserIdDisplay() {
  const [userId, setUserId] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('firebase-user-id')
      if (id) {
        setUserId(id)
      }
    }
  }, [])

  const handleCopy = () => {
    if (userId) {
      navigator.clipboard.writeText(userId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!userId) return null

  return (
    <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 mb-4 text-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-blue-200 font-semibold mb-1">Your User ID:</p>
          <p className="text-blue-100 font-mono text-xs break-all">{userId}</p>
          <p className="text-blue-300 text-xs mt-1">
            💡 Copy this ID to sync data across devices
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-2"
          title="Copy User ID"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

