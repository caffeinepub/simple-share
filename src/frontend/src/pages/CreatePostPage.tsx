import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreatePost, useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ContentType } from '../backend';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const createPost = useCreatePost();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<ContentType>(ContentType.text);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileName, setProfileName] = useState('');

  // Form validation errors
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    content?: string;
    imageUrl?: string;
  }>({});

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      setShowProfileSetup(true);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleProfileSetup = async () => {
    if (!profileName.trim()) return;
    
    try {
      await saveProfile.mutateAsync({ name: profileName.trim() });
      setShowProfileSetup(false);
      toast.success('Profile created successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (contentType === ContentType.link || contentType === ContentType.image) {
      // Validate URL format
      try {
        new URL(content.trim());
      } catch {
        newErrors.content = 'Please enter a valid URL';
      }
    }

    if (imageUrl.trim()) {
      try {
        new URL(imageUrl.trim());
      } catch {
        newErrors.imageUrl = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    try {
      await createPost.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        contentType,
        content: content.trim(),
        imageUrl: imageUrl.trim() || null,
      });

      toast.success('Post created successfully!');

      // Reset form
      setTitle('');
      setDescription('');
      setContent('');
      setImageUrl('');
      setContentType(ContentType.text);
      setErrors({});

      navigate({ to: '/' });
    } catch (error) {
      // Error is already handled in useCreatePost hook
      console.error('Failed to create post:', error);
    }
  };

  if (isInitializing || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>Share your content with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  placeholder="Enter post title"
                  required
                  disabled={createPost.isPending}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: undefined });
                  }}
                  placeholder="Enter post description"
                  rows={3}
                  required
                  disabled={createPost.isPending}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                  value={contentType}
                  onValueChange={(value) => setContentType(value as ContentType)}
                  disabled={createPost.isPending}
                >
                  <SelectTrigger id="contentType">
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
                <Label htmlFor="content">
                  {contentType === ContentType.text && 'Text Content'}
                  {contentType === ContentType.link && 'Link URL'}
                  {contentType === ContentType.image && 'Image URL'}
                </Label>
                {contentType === ContentType.text ? (
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      if (errors.content) setErrors({ ...errors, content: undefined });
                    }}
                    placeholder="Enter your content"
                    rows={5}
                    required
                    disabled={createPost.isPending}
                    className={errors.content ? 'border-destructive' : ''}
                  />
                ) : (
                  <Input
                    id="content"
                    type="url"
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      if (errors.content) setErrors({ ...errors, content: undefined });
                    }}
                    placeholder={contentType === ContentType.link ? 'https://example.com' : 'https://example.com/image.jpg'}
                    required
                    disabled={createPost.isPending}
                    className={errors.content ? 'border-destructive' : ''}
                  />
                )}
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content}</p>
                )}
              </div>

              {contentType === ContentType.link && (
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Preview Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (errors.imageUrl) setErrors({ ...errors, imageUrl: undefined });
                    }}
                    placeholder="https://example.com/preview.jpg"
                    disabled={createPost.isPending}
                    className={errors.imageUrl ? 'border-destructive' : ''}
                  />
                  {errors.imageUrl && (
                    <p className="text-sm text-destructive">{errors.imageUrl}</p>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={createPost.isPending}>
                {createPost.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Post'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showProfileSetup} onOpenChange={setShowProfileSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to MOD x RDX!</DialogTitle>
            <DialogDescription>
              Please enter your name to complete your profile setup.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profileName">Your Name</Label>
              <Input
                id="profileName"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && profileName.trim()) {
                    handleProfileSetup();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleProfileSetup}
              disabled={!profileName.trim() || saveProfile.isPending}
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
