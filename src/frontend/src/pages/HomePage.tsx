import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetAllPosts, useSearchPosts } from '../hooks/useQueries';
import { PostCard } from '../components/PostCard';
import { SearchBar } from '../components/SearchBar';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: allPosts, isLoading: isLoadingAll } = useGetAllPosts();
  const { data: searchResults, isLoading: isSearching } = useSearchPosts(searchTerm);

  const posts = searchTerm ? searchResults : allPosts;
  const isLoading = searchTerm ? isSearching : isLoadingAll;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="flex items-center justify-center gap-4 mb-8">
          <img 
            src="/assets/icon.png" 
            alt="MOD x RDX" 
            className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover"
          />
          <span className="font-bold text-3xl sm:text-4xl">MOD x RDX</span>
        </Link>
        
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Latest Posts</h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Share text, links, and images with the community
          </p>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id.toString()} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm ? 'No posts found matching your search.' : 'No posts yet. Be the first to share!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
