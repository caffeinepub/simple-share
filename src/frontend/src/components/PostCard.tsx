import { useState } from 'react';
import { Post, ContentType } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, FileText, Link as LinkIcon, Image as ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useIsCallerAdmin, useUpdatePost, useDeletePost } from '../hooks/useQueries';
import { EditPostDialog } from './EditPostDialog';
import { DeletePostDialog } from './DeletePostDialog';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const [imageError, setImageError] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: isAdmin } = useIsCallerAdmin();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getContentTypeIcon = () => {
    switch (post.contentType) {
      case ContentType.text:
        return <FileText className="w-4 h-4" />;
      case ContentType.link:
        return <LinkIcon className="w-4 h-4" />;
      case ContentType.image:
        return <ImageIcon className="w-4 h-4" />;
    }
  };

  const getContentTypeBadge = () => {
    const labels = {
      [ContentType.text]: 'Text',
      [ContentType.link]: 'Link',
      [ContentType.image]: 'Image',
    };
    return labels[post.contentType];
  };

  const handleUpdatePost = async (data: {
    postId: bigint;
    title: string;
    description: string;
    contentType: ContentType;
    content: string;
    imageUrl: string | null;
  }) => {
    try {
      await updatePostMutation.mutateAsync(data);
      setEditDialogOpen(false);
      toast.success('Post updated successfully');
    } catch (error: any) {
      console.error('Error updating post:', error);
      // Error toast is already handled in useUpdatePost hook
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePostMutation.mutateAsync(post.id);
      setDeleteDialogOpen(false);
      toast.success('Post deleted successfully');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      // Error toast is already handled in useDeletePost hook
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl mb-2">{post.title}</CardTitle>
              <CardDescription className="text-base">{post.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary" className="flex items-center gap-1.5">
                {getContentTypeIcon()}
                <span className="hidden sm:inline">{getContentTypeBadge()}</span>
              </Badge>
              {isAdmin && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditDialogOpen(true)}
                    className="h-8 w-8"
                    title="Edit post"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">{formatDate(post.timestamp)}</p>
          </div>
        </CardHeader>
        <CardContent>
          {post.contentType === ContentType.text && (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground">{post.content}</p>
            </div>
          )}

          {post.contentType === ContentType.link && (
            <div className="space-y-4">
              {post.imageUrl && !imageError && (
                <img
                  src={post.imageUrl}
                  alt="Link preview"
                  className="w-full h-48 object-cover rounded-md cursor-pointer"
                  onError={() => setImageError(true)}
                />
              )}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <a
                  href={post.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium hover:underline break-all"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span className="truncate">{post.content}</span>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(post.content)}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          )}

          {post.contentType === ContentType.image && (
            <div className="space-y-4">
              {!imageError ? (
                <img
                  src={post.content}
                  alt={post.title}
                  className="w-full rounded-md cursor-pointer"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Failed to load image</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <a
                  href={post.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium hover:underline break-all"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span className="truncate">View full image</span>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(post.content)}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {isCopied ? 'Copied!' : 'Copy URL'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EditPostDialog
        post={post}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleUpdatePost}
        isLoading={updatePostMutation.isPending}
      />

      <DeletePostDialog
        postTitle={post.title}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeletePost}
        isLoading={deletePostMutation.isPending}
      />
    </>
  );
}
