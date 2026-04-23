import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // MyMemory API uses langpair like 'en|bn'
    // Determine the source language (assume en if target is bn, and vice versa)
    const sourceLanguage = targetLanguage === 'bn' ? 'en' : 'bn';
    const langpair = `${sourceLanguage}|${targetLanguage}`;

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`
    );

    const data = await response.json();

    if (!response.ok || data.responseStatus !== 200) {
        console.error('MyMemory Translation Error:', data.responseDetails);
        return NextResponse.json({ error: data.responseDetails || 'Translation failed' }, { status: response.status });
    }

    const translatedText = data.responseData.translatedText;
    return NextResponse.json({ translatedText });
    
  } catch (err) {
    console.error('Translation error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
