import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreatePost } from '../hooks/useQueries';
import { ContentType } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { mutate: createPost, isPending } = useCreatePost();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<ContentType>(ContentType.text);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !content.trim()) {
      return;
    }

    createPost(
      {
        title: title.trim(),
        description: description.trim(),
        contentType,
        content: content.trim(),
        imageUrl: imageUrl.trim() || null,
      },
      {
        onSuccess: () => {
          navigate({ to: '/' });
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Create New Post</h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Share your thoughts, links, or images with the community
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <CardDescription>Fill in the information below to create your post</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter a catchy title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your post"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Content Type *</Label>
                <RadioGroup value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ContentType.text} id="text" />
                    <Label htmlFor="text" className="font-normal cursor-pointer">
                      Text
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ContentType.link} id="link" />
                    <Label htmlFor="link" className="font-normal cursor-pointer">
                      Link
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ContentType.image} id="image" />
                    <Label htmlFor="image" className="font-normal cursor-pointer">
                      Image
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">
                  {contentType === ContentType.text && 'Content *'}
                  {contentType === ContentType.link && 'Link URL *'}
                  {contentType === ContentType.image && 'Image URL *'}
                </Label>
                {contentType === ContentType.text ? (
                  <Textarea
                    id="content"
                    placeholder="Write your content here"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    required
                  />
                ) : (
                  <Input
                    id="content"
                    type="url"
                    placeholder={contentType === ContentType.link ? 'https://example.com' : 'https://example.com/image.jpg'}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                )}
              </div>

              {contentType === ContentType.link && (
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Preview Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/preview.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isPending} className="flex-1 sm:flex-none">
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Post'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/' })}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
