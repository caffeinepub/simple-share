import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { PostCard } from '../components/PostCard';
import { SearchBar } from '../components/SearchBar';
import { useGetAllPosts, useSearchPosts } from '../hooks/useQueries';
import { Skeleton } from '../components/ui/skeleton';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: allPosts, isLoading: allPostsLoading } = useGetAllPosts();
  const { data: searchResults, isLoading: searchLoading } = useSearchPosts(searchTerm);

  const isSearching = searchTerm.trim().length > 0;
  const posts = isSearching ? searchResults : allPosts;
  const isLoading = isSearching ? searchLoading : allPostsLoading;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col items-center gap-6 mb-12">
        <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <img
            src="/assets/icon.png"
            alt="MOD x RDX"
            className="w-20 h-20 rounded-full object-cover"
          />
          <h1 className="text-4xl md:text-5xl font-bold">MOD x RDX</h1>
        </Link>
        <p className="text-lg text-muted-foreground text-center max-w-2xl">
          Share and discover content with the community
        </p>
      </div>

      <div className="mb-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id.toString()} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {isSearching ? 'No posts found matching your search.' : 'No posts yet. Be the first to share!'}
          </p>
        </div>
      )}
    </div>
  );
}
