
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addQuestion, uploadImage } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PenSquare, X } from 'lucide-react';
import type { User } from '@/types';
import { useState } from 'react';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters long.'),
  content: z.string().min(20, 'Question must be at least 20 characters long.'),
  tags: z.string().min(1, 'Please add at least one tag.'),
  image: z.instanceof(File).optional(),
});

const anonymousUser: User = {
    uid: 'anonymous',
    displayName: 'Anonymous User',
    photoURL: `https://placehold.co/100x100.png`,
    score: 0,
};

export function QuestionForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: '',
      image: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue('image', undefined);
    // Also reset the file input visually
    const fileInput = document.getElementById('image-input') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const author = user || anonymousUser;
    
    try {
      let imageUrl: string | undefined = undefined;
      if (values.image) {
        imageUrl = await uploadImage(values.image);
      }

      const tagsArray = values.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      await addQuestion({
          title: values.title,
          content: values.content,
          tags: tagsArray,
          author: author,
          imageUrl: imageUrl,
      });

      toast({ title: 'Success!', description: 'Your question has been posted.' });
      form.reset();
      removeImage();
    } catch (error) {
       console.error("Error posting question: ", error);
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
       toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <PenSquare className="h-6 w-6" />
            Ask a Question
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., How to implement Firebase auth?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your issue in detail..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., firebase, react, nextjs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image (Optional)</FormLabel>
                  <FormControl>
                    <Input id="image-input" type="file" accept="image/*" onChange={handleImageChange} />
                  </FormControl>
                  <FormDescription>
                    Upload an image to help explain your question.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {imagePreview && (
              <div className="relative w-full h-48 rounded-md overflow-hidden">
                <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Posting...' : 'Post Question'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
