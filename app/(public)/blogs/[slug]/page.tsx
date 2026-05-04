import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { Metadata } from 'next'
import BlogDetailClient from '@/components/blogs/BlogDetailClient'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: post } = await supabase.from('posts').select('*').eq('slug', params.slug).single()

  if (!post) return { title: 'Not Found | Popcorn' }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://popcorn.example.com'
  const fullUrl = `${baseUrl}/${post.category}/${post.slug}`
  const title = `${post.title} | Popcorn`
  const description = post.meta_description || post.content?.substring(0, 160) || ''

  return {
    title,
    description,
    keywords: `${post.title}, ${post.genre}, ${post.language_tag}, film blog, news`,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'Popcorn',
      images: post.cover_image ? [
        {
          url: post.cover_image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.cover_image ? [post.cover_image] : [],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const supabase = createClient()
  
  // 1. Fetch current post
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!post) {
    notFound()
  }

  // 2. Fetch 3 related posts (same category, different slug)
  const { data: relatedPosts } = await supabase
    .from('posts')
    .select('*')
    .eq('category', 'blogs')
    .eq('status', 'published')
    .neq('slug', params.slug)
    .limit(3)
    .order('created_at', { ascending: false })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://popcorn.example.com'
  const fullUrl = `${baseUrl}/${post.category}/${post.slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.meta_description,
    "image": post.cover_image,
    "datePublished": post.created_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Organization",
      "name": "Popcorn"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Popcorn",
      "url": baseUrl
    },
    "mainEntityOfPage": fullUrl,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailClient post={post} relatedPosts={relatedPosts || []} />
    </>
  )
}
