
'use client';

import { onQuestionSnapshot, handleVote } from '@/lib/store';
import type { Answer, Question } from '@/types';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { AnswerCard } from './AnswerCard';
import { AnswerForm } from './AnswerForm';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/button';
import { Loader2, Sparkles, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { getAiSuggestion } from '@/app/actions';
import { User } from '@/types';
import { Separator } from '../ui/separator';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface QuestionDetailsProps {
  questionId: string;
}

export function QuestionDetails({ questionId }: QuestionDetailsProps) {
  const [question, setQuestion] = useState<Question | null | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<Answer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onQuestionSnapshot(
      questionId,
      (data) => {
        setQuestion(data as Question);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching question in real-time: ", error);
        setQuestion(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [questionId]);


  const handleNewAnswer = (answer: Answer) => {
    // With real-time updates, we don't need to manually update the state here.
    // Firestore's onSnapshot will do it for us.
  };

  const onVote = async (voteType: 'up' | 'down') => {
    if (!user) {
        toast({ title: 'Authentication Required', description: 'You must be logged in to vote.', variant: 'destructive' });
        return;
    }
    if (!question) return;

    try {
        await handleVote('questions', question.id, user.uid, voteType);
    } catch(e) {
        console.error(e);
        toast({ title: 'Error', description: 'There was an error submitting your vote.', variant: 'destructive' });
    }
  }

  const handleAiSuggest = async () => {
    if (!question) return;
    setIsAiLoading(true);
    const suggestionText = await getAiSuggestion(
      `${question.title}: ${question.content}`
    );
    const aiUser: User = {
      uid: 'ai-assistant',
      displayName: 'AI Assistant',
      photoURL: '',
      score: 0,
    };
    const suggestion: Answer = {
      id: 'ai-suggestion-' + Date.now(),
      author: aiUser,
      content: suggestionText,
      createdAt: new Date(),
      isAiSuggestion: true,
      score: 0,
      votes: {},
    };
    setAiAnswer(suggestion);
    setIsAiLoading(false);
  };

  if (loading) {
    return <Skeleton className="w-full h-[500px]" />;
  }

  if (!question) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Question not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sorry, we couldn't find the question you're looking for.</p>
        </CardContent>
      </Card>
    );
  }

  const answers = question.answers || [];
  const userVote = user ? question.votes?.[user.uid] : undefined;

  return (
    <div className="space-y-6">
      <Card className="flex gap-4 p-6">
        <div className="flex flex-col items-center gap-1">
            <Button variant={userVote === 'up' ? 'default': 'outline'} size="icon" className="h-8 w-8" onClick={() => onVote('up')} disabled={!user}>
                <ArrowUp className="h-4 w-4"/>
            </Button>
            <span className="text-xl font-bold">{question.score ?? 0}</span>
             <Button variant={userVote === 'down' ? 'destructive': 'outline'} size="icon" className="h-8 w-8" onClick={() => onVote('down')} disabled={!user}>
                <ArrowDown className="h-4 w-4"/>
            </Button>
        </div>
        <div className="flex-1">
            <CardHeader className="p-0">
            <div className="flex items-center gap-2 mb-2">
                {question.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                    {tag}
                </Badge>
                ))}
            </div>
            <CardTitle className="text-3xl font-bold">{question.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={question.author.photoURL || ''}
                        alt={question.author.displayName || ''}
                    />
                    <AvatarFallback>
                        {question.author.displayName?.charAt(0)}
                    </AvatarFallback>
                    </Avatar>
                    <span>
                    Asked by{' '}
                    <span className="font-medium text-foreground">
                        {question.author.displayName}
                    </span>{' '}
                    on {format(new Date(question.createdAt as any), 'PPP')}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{question.views ?? 0} views</span>
                </div>
            </div>
            </CardHeader>
            <CardContent className="p-0 mt-4 space-y-4">
                {question.imageUrl && (
                  <div className="relative w-full h-96 rounded-md overflow-hidden border">
                    <Image src={question.imageUrl} alt={question.title} layout="fill" objectFit="contain" />
                  </div>
                )}
                <MarkdownRenderer content={question.content} />
            </CardContent>
            <CardFooter className="p-0 mt-4">
                <Button onClick={handleAiSuggest} disabled={isAiLoading || !!aiAnswer || !user}>
                    {isAiLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Suggest an Answer
                        </>
                    )}
                </Button>
            </CardFooter>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold">
            Answers ({answers.length + (aiAnswer ? 1 : 0)})
        </h3>
        <Separator />
        {aiAnswer && <AnswerCard answer={aiAnswer} questionId={question.id} />}

        {answers.length > 0 ? (
          answers.map(answer => (
            <AnswerCard key={answer.id} answer={answer} questionId={question.id} />
          ))
        ) : (
          !aiAnswer && <p className="text-muted-foreground">No answers yet. Be the first to help!</p>
        )}
      </div>

      <AnswerForm questionId={question.id} onNewAnswer={handleNewAnswer} />
    </div>
  );
}
