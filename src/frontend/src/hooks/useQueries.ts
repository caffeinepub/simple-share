import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Post, ContentType, UserProfile } from '../backend';
import { toast } from 'sonner';

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchPosts(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['posts', 'search', searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm.trim()) return [];
      return actor.searchPosts(searchTerm.trim());
    },
    enabled: !!actor && !isFetching && searchTerm.trim().length > 0,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      contentType: ContentType;
      content: string;
      imageUrl: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(
        data.title,
        data.description,
        data.contentType,
        data.content,
        data.imageUrl
      );
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      console.error('Failed to create post:', error);
      
      // Handle different error types
      if (error.message?.includes('Unauthorized')) {
        toast.error('You do not have permission to create posts. Please log in.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (error.message?.includes('Actor not available')) {
        toast.error('Connection to backend failed. Please refresh and try again.');
      } else {
        toast.error(error.message || 'Failed to create post. Please try again.');
      }
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      postId: bigint;
      title: string;
      description: string;
      contentType: ContentType;
      content: string;
      imageUrl: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePost(
        data.postId,
        data.title,
        data.description,
        data.contentType,
        data.content,
        data.imageUrl
      );
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      console.error('Failed to update post:', error);
      
      if (error.message?.includes('Unauthorized')) {
        toast.error('You do not have permission to update posts.');
      } else if (error.message?.includes('does not exist')) {
        toast.error('Post not found. It may have been deleted.');
      } else {
        toast.error(error.message || 'Failed to update post. Please try again.');
      }
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePost(postId);
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      console.error('Failed to delete post:', error);
      
      if (error.message?.includes('Unauthorized')) {
        toast.error('You do not have permission to delete posts.');
      } else if (error.message?.includes('does not exist')) {
        toast.error('Post not found. It may have already been deleted.');
      } else {
        toast.error(error.message || 'Failed to delete post. Please try again.');
      }
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error: any) => {
      console.error('Failed to save profile:', error);
      toast.error(error.message || 'Failed to save profile. Please try again.');
    },
  });
}
