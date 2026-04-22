export async function translateText(text: string, targetLanguage: 'bn' | 'en') {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY
  if (!apiKey) {
    throw new Error('Google Translate API key is missing')
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        format: 'html' // Important for TipTap content
      }),
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json()
    if (data.error) {
      throw new Error(data.error.message)
    }

    return data.data.translations[0].translatedText
  } catch (error: unknown) {
    console.error('Translation error:', error)
    throw error
  }
}
