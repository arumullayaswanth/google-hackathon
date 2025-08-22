
'use client';

import type { Answer } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Sparkles, ArrowUp, ArrowDown, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';
import { handleVote } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

interface AnswerCardProps {
  answer: Answer;
  questionId: string;
}

export function AnswerCard({ answer, questionId }: AnswerCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const onVote = async (voteType: 'up' | 'down') => {
    if (!user) {
        toast({ title: 'Authentication Required', description: 'You must be logged in to vote.', variant: 'destructive' });
        return;
    }
    if (answer.isAiSuggestion || answer.author.uid === 'anonymous') return;

    try {
        await handleVote('answers', answer.id, user.uid, voteType, questionId);
    } catch(e) {
        console.error(e);
        toast({ title: 'Error', description: 'There was an error submitting your vote.', variant: 'destructive' });
    }
  }

  const userVote = user ? answer.votes?.[user.uid] : undefined;
  const isInteractive = !answer.isAiSuggestion && user && answer.author.uid !== 'anonymous';

  return (
    <Card className={cn('flex gap-4 p-6', answer.isAiSuggestion && 'border-accent bg-accent/10')}>
      <div className="flex flex-col items-center gap-1">
          {isInteractive ? (
              <>
                <Button variant={userVote === 'up' ? 'default': 'outline'} size="icon" className="h-8 w-8" onClick={() => onVote('up')}>
                    <ArrowUp className="h-4 w-4"/>
                </Button>
                <span className="text-xl font-bold">{answer.score ?? 0}</span>
                <Button variant={userVote === 'down' ? 'destructive': 'outline'} size="icon" className="h-8 w-8" onClick={() => onVote('down')}>
                    <ArrowDown className="h-4 w-4"/>
                </Button>
              </>
          ) : (
             <div className="flex flex-col items-center gap-1 opacity-50">
                <Button variant='outline' size="icon" className="h-8 w-8" disabled>
                    <ArrowUp className="h-4 w-4"/>
                </Button>
                <span className="text-xl font-bold">{answer.score ?? 0}</span>
                <Button variant='outline' size="icon" className="h-8 w-8" disabled>
                    <ArrowDown className="h-4 w-4"/>
                </Button>
              </div>
          )}
      </div>
      <div className="flex-1">
        <CardHeader className="flex-row items-center justify-between p-0">
            <div className="flex items-center gap-3">
            {answer.isAiSuggestion ? (
                <Avatar className="h-10 w-10 bg-accent/30 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-accent-foreground" />
                </Avatar>
            ) : answer.author.uid === 'anonymous' ? (
                <Avatar className="h-10 w-10">
                     <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                </Avatar>
            ) : (
                <Avatar className="h-10 w-10">
                <AvatarImage
                    src={answer.author.photoURL || ''}
                    alt={answer.author.displayName || ''}
                />
                <AvatarFallback>
                    {answer.author.displayName?.charAt(0)}
                </AvatarFallback>
                </Avatar>
            )}
            <div>
                <p className="font-semibold text-foreground">
                    {answer.author.displayName}
                </p>
                <p className="text-sm text-muted-foreground">
                    answered {formatDistanceToNow(new Date(answer.createdAt as any), { addSuffix: true })}
                </p>
            </div>
            </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
            <MarkdownRenderer content={answer.content} />
        </CardContent>
      </div>
    </Card>
  );
}
