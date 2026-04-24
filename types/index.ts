export type PostCategory = string;
export type LanguageTag = string;

export type PostStatus = 'draft' | 'published';

export type DownloadLink = {
  label: string;
  url?: string;
  slug: string;
  quality: string;
  size?: string;
  message_id?: number;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  meta_description: string | null;
  cover_image: string | null;
  category: PostCategory;
  language_tag: LanguageTag;
  genre: string | null;
  trailer_url: string | null;
  download_links: DownloadLink[];
  status: PostStatus;
  word_count: number;
  is_featured: boolean;
  avg_rating?: number;
  total_reviews?: number;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string | null;
  user_avatar: string | null;
  content: string;
  created_at: string;
};
export type AdminComment = Comment & {
  posts: {
    title: string;
    slug: string;
  } | null;
};

export type Review = {
  id: string;
  post_id: string;
  user_id: string;
  rating: number;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: Post;
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'word_count'>;
        Update: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at'>;
        Update: Partial<Omit<Comment, 'id' | 'created_at'>>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at'>;
        Update: Partial<Omit<Review, 'id' | 'created_at'>>;
      };
    };
  };
};
