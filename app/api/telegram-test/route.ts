import { NextResponse } from 'next/server'

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`)
    const data = await response.json()
    
    if (data.ok) {
      return NextResponse.json({ 
        status: 'Connected', 
        bot: data.result.username,
        id: data.result.id 
      })
    } else {
      return NextResponse.json({ 
        status: 'Error', 
        message: data.description 
      }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ 
      status: 'Error', 
      message: err.message 
    }, { status: 500 })
  }
}
