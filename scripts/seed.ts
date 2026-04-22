import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for seeding

const supabase = createClient(supabaseUrl, supabaseKey)

const movies = [
  {
    title: 'Interstellar',
    slug: 'interstellar',
    meta_description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    cover_image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2694&auto=format&fit=crop',
    category: 'trailer',
    language_tag: 'english',
    status: 'published',
    trailer_url: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    word_count: 500,
  },
  {
    title: 'The Dark Knight',
    slug: 'the-dark-knight',
    meta_description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.',
    cover_image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2670&auto=format&fit=crop',
    category: 'review',
    language_tag: 'english',
    status: 'published',
    trailer_url: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    word_count: 800,
  },
  {
    title: 'Your Name',
    slug: 'your-name',
    meta_description: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
    cover_image: 'https://images.unsplash.com/photo-1578632738980-43314a574d67?q=80&w=2574&auto=format&fit=crop',
    category: 'movie-blog',
    language_tag: 'anime',
    status: 'published',
    word_count: 1200,
  },
  {
    title: 'Inception',
    slug: 'inception',
    meta_description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
    cover_image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2670&auto=format&fit=crop',
    category: 'movie-news',
    language_tag: 'english',
    status: 'published',
    trailer_url: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    word_count: 600,
  },
  {
    title: 'Hawa',
    slug: 'hawa',
    meta_description: 'A mystery drama about a group of fishermen caught in a strange occurrence in the deep sea.',
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2574&auto=format&fit=crop',
    category: 'movie-blog',
    language_tag: 'bangla',
    status: 'published',
    word_count: 750,
  }
]

async function seed() {
  console.log('Seeding data...')
  
  // Clear existing data
  const { error: deleteError } = await supabase.from('posts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    console.error('Error clearing posts:', deleteError)
    return
  }

  const { data, error } = await supabase.from('posts').insert(movies).select()

  if (error) {
    console.error('Error seeding posts:', error)
  } else {
    console.log(`Successfully seeded ${data.length} posts.`)
    
    // Seed some reviews
    const reviews = data.map(post => ({
        post_id: post.id,
        user_id: '86819e91-7f93-4a69-897b-91c686121960', // Placeholder UUID
        rating: Math.floor(Math.random() * 2) + 4 // 4 or 5 stars
    }))
    
    // Note: This user_id must exist in auth.users if we have FK constraint on auth.users 
    // In many supabase setups, you can't insert into auth.users directly easily.
    // For now, let's omit the FK constraint-dependent inserts or just insert posts.
  }
}

seed()
