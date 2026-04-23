# Popcorn Deployment Guide (Vercel)

Ensure the following environment variables are added to your Vercel project settings:

### Supabase Settings
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key
- `SUPABASE_SERVICE_ROLE_KEY`: Service Role key (only needed if doing admin operations)

### External APIs
- (No API keys needed for translation - now using MyMemory)

### Site Configuration
- `NEXT_PUBLIC_BASE_URL`: The production URL of your site (e.g., `https://popcorn.com`)

## Deploy Steps
1. Push your code to GitHub.
2. Link your repository to Vercel.
3. Paste the variables above into the "Environment Variables" section.
4. Click **Deploy**.
