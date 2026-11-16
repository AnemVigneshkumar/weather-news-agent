const BASE_URL = import.meta.env.VITE_API_URL || '/api'
export async function sendMessage(message, threadId) {
  const response = await fetch(`${BASE_URL}/agent/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, thread_id: threadId }),
  })

  if (!response.ok) {
    let detail = 'Something went wrong. Please try again.'
    try {
      const data = await response.json()
      if (typeof data.detail === 'string') {
        detail = data.detail
      }
    } catch {
      // keep the default message
    }
    if (detail.includes('429')) {
      detail = 'Rate limit reached. Please wait a minute and try again.'
    }
    throw new Error(detail)
  }

  const data = await response.json()
  return data.reply
}