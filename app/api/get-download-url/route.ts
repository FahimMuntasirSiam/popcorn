import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use Service Role for internal DB operations (logging & rate limiting)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID

export async function POST(req: NextRequest) {
  try {
    const { postSlug, linkSlug, token, timestamp } = await req.json()
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'

    // 1. Basic Validation
    if (!token || !postSlug || !linkSlug || !timestamp) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 403 })
    }

    // 2. Timing Validation (at least 14 seconds)
    const now = Date.now()
    const elapsed = now - timestamp
    if (elapsed < 14000) {
      return NextResponse.json({ error: 'Too fast. Please wait for the timer.' }, { status: 403 })
    }

    // 3. Rate Limiting (5 per hour per IP)
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
    const { count, error: countError } = await supabaseAdmin
      .from('downloads_log')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gt('created_at', oneHourAgo)

    if (countError) throw countError
    if (count !== null && count >= 5) {
      return NextResponse.json({ error: 'Too many requests. Try again in an hour.' }, { status: 429 })
    }

    // 4. Fetch Post & Link Data
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('id, download_links')
      .eq('slug', postSlug)
      .single()

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const link = post.download_links?.find((l: any) => l.slug === linkSlug)
    if (!link || !link.message_id) {
      return NextResponse.json({ error: 'Download link not configured' }, { status: 404 })
    }

    // 5. Telegram Integration
    // Step A: Forward message to get the file object
    const forwardResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/forwardMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL_ID, // Forwarding to the same channel is a trick to get the message object
        from_chat_id: TELEGRAM_CHANNEL_ID,
        message_id: link.message_id,
        disable_notification: true
      })
    })

    const forwardData = await forwardResponse.json()
    if (!forwardData.ok) {
      console.error('Telegram Forward Error:', forwardData)
      return NextResponse.json({ error: 'Could not fetch file from Telegram' }, { status: 500 })
    }

    // Extract file_id from the forwarded message
    const msg = forwardData.result
    const fileObject = msg.document || msg.video || msg.audio || msg.video_note || msg.animation
    
    if (!fileObject || !fileObject.file_id) {
      return NextResponse.json({ error: 'No file found in Telegram message' }, { status: 404 })
    }

    // Delete the forwarded message to keep channel clean
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL_ID,
        message_id: msg.message_id
      })
    })

    // Step B: Get File Path
    const fileResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileObject.file_id}`)
    const fileData = await fileResponse.json()
    
    if (!fileData.ok) {
      return NextResponse.json({ error: 'Telegram Link Generation Failed' }, { status: 500 })
    }

    const filePath = fileData.result.file_path
    const downloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`

    // 6. Log the download
    await supabaseAdmin.from('downloads_log').insert({
      post_slug: postSlug,
      link_slug: linkSlug,
      ip_address: ip
    })

    return NextResponse.json({ url: downloadUrl })

  } catch (err: any) {
    console.error('Download API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
