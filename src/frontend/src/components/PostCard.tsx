import { Post, ContentType } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, FileText, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useState } from 'react';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const [imageError, setImageError] = useState(false);

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl sm:text-2xl mb-2">{post.title}</CardTitle>
            <CardDescription className="text-base">{post.description}</CardDescription>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1.5 shrink-0">
            {getContentTypeIcon()}
            <span className="hidden sm:inline">{getContentTypeBadge()}</span>
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{formatDate(post.timestamp)}</p>
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
          <div className="space-y-3">
            {!imageError ? (
              <img
                src={post.content}
                alt={post.title}
                className="w-full max-h-96 object-contain rounded-md cursor-pointer"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Failed to load image</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
