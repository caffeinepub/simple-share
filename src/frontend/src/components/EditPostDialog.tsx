import { useState, useEffect } from 'react';
import { Post, ContentType } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface EditPostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    postId: bigint;
    title: string;
    description: string;
    contentType: ContentType;
    content: string;
    imageUrl: string | null;
  }) => void;
  isLoading?: boolean;
}

export function EditPostDialog({ post, open, onOpenChange, onSave, isLoading }: EditPostDialogProps) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [contentType, setContentType] = useState<ContentType>(post.contentType);
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.imageUrl || '');

  useEffect(() => {
    if (open) {
      setTitle(post.title);
      setDescription(post.description);
      setContentType(post.contentType);
      setContent(post.content);
      setImageUrl(post.imageUrl || '');
    }
  }, [open, post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !content.trim()) {
      return;
    }

    onSave({
      postId: post.id,
      title: title.trim(),
      description: description.trim(),
      contentType,
      content: content.trim(),
      imageUrl: imageUrl.trim() || null,
    });
  };

  const getContentLabel = () => {
    switch (contentType) {
      case ContentType.text:
        return 'Text Content';
      case ContentType.link:
        return 'Link URL';
      case ContentType.image:
        return 'Image URL';
    }
  };

  const getContentPlaceholder = () => {
    switch (contentType) {
      case ContentType.text:
        return 'Enter your text content...';
      case ContentType.link:
        return 'https://example.com';
      case ContentType.image:
        return 'https://example.com/image.jpg';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter post description"
                rows={3}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content-type">Content Type</Label>
              <Select
                value={contentType}
                onValueChange={(value) => setContentType(value as ContentType)}
                disabled={isLoading}
              >
                <SelectTrigger id="edit-content-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ContentType.text}>Text</SelectItem>
                  <SelectItem value={ContentType.link}>Link</SelectItem>
                  <SelectItem value={ContentType.image}>Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content">{getContentLabel()}</Label>
              {contentType === ContentType.text ? (
                <Textarea
                  id="edit-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={getContentPlaceholder()}
                  rows={5}
                  required
                  disabled={isLoading}
                />
              ) : (
                <Input
                  id="edit-content"
                  type="url"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={getContentPlaceholder()}
                  required
                  disabled={isLoading}
                />
              )}
            </div>

            {contentType === ContentType.link && (
              <div className="space-y-2">
                <Label htmlFor="edit-image-url">Preview Image URL (Optional)</Label>
                <Input
                  id="edit-image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/preview.jpg"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
