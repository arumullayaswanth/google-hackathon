
'use client';

import type { Question } from '@/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { MessageSquare, ArrowUp, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const getDisplayDate = () => {
    if (!question.createdAt) return '';
    // Convert Firestore Timestamp to JS Date if needed
    const date = question.createdAt instanceof Timestamp ? question.createdAt.toDate() : new Date(question.createdAt);
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'just now';
    }
  };

  const upvotes = Object.values(question.votes || {}).filter(v => v === 'up').length;

  return (
    <Link href={`/questions/${question.id}`} className="block">
      <Card className="hover:border-primary transition-colors duration-300">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold">{question.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{question.views ?? 0}</span>
                </div>
                <div className="flex items-center gap-1">
                    <ArrowUp className="h-4 w-4" />
                    <span>{upvotes}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question.answers?.length ?? 0}</span>
                </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground line-clamp-2">
                {question.content}
            </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={question.author.photoURL || ''} alt={question.author.displayName || ''} data-ai-hint="person avatar"/>
                    <AvatarFallback>{question.author.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium">{question.author.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                        asked {getDisplayDate()}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {question.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
