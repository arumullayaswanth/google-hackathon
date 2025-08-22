'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addAnswer } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Answer, User } from '@/types';

const formSchema = z.object({
  content: z.string().min(10, 'Answer must be at least 10 characters long.'),
});

interface AnswerFormProps {
  questionId: string;
  onNewAnswer: (answer: Answer) => void;
}

const anonymousUser: User = {
    uid: 'anonymous',
    displayName: 'Anonymous User',
    photoURL: `https://placehold.co/100x100.png`,
    score: 0,
};

export function AnswerForm({ questionId, onNewAnswer }: AnswerFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const author = user || anonymousUser;

    try {
      const newAnswer = (await addAnswer(questionId, {
        content: values.content,
        author: author,
      })) as Answer;
      
      onNewAnswer(newAnswer);
      toast({ title: 'Success!', description: 'Your answer has been posted.' });
      form.reset();
    } catch (error) {
      console.error("Error posting answer: ", error);
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
        <CardTitle>Your Answer</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Share your knowledge with the community..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Posting...' : 'Post Answer'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
