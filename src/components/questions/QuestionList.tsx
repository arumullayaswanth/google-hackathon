'use client';

import { onQuestionsSnapshot } from '@/lib/store';
import type { Question } from '@/types';
import { useEffect, useState, useMemo } from 'react';
import { QuestionCard } from './QuestionCard';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { useSearchParams } from 'next/navigation';
import { useHackathon } from '@/context/HackathonContext';

export function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const tagFilter = searchParams.get('tag');
  const { isHackathonMode } = useHackathon();

  useEffect(() => {
    const unsubscribe = onQuestionsSnapshot(
      (data) => {
        setQuestions(data as Question[]);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching questions in real-time:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isHackathonMode) {
        setSelectedTags(['hackathon']);
    } else if (tagFilter) {
      setSelectedTags([tagFilter]);
    } else {
      setSelectedTags([]);
    }
  }, [tagFilter, isHackathonMode]);

  const allTags = useMemo(() => {
    if (loading) return [];
    const tags = new Set<string>();
    questions.forEach((q) => q.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [questions, loading]);

  const toggleTag = (tag: string) => {
    if (isHackathonMode && tag === 'hackathon') return;
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        question.title.toLowerCase().includes(searchLower) ||
        question.content.toLowerCase().includes(searchLower);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => question.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [questions, searchTerm, selectedTags]);

  const hasActiveFilters = searchTerm || selectedTags.length > 0;

  return (
    <div className="space-y-6">
       <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          {isHackathonMode ? 'Hackathon Questions' : 'Recent Questions'}
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {!isHackathonMode && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                onClick={() => toggleTag(tag)}
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-4">
        {loading ? (
           [...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-lg" />
          ))
        ) : filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        ) : (
            <Card className="text-center py-12">
                <CardContent>
                    <h3 className="text-xl font-semibold mb-2">
                        {hasActiveFilters ? 'No Questions Found' : 'Be the First to Ask!'}
                    </h3>
                    <p className="text-muted-foreground">
                        {hasActiveFilters 
                            ? 'No questions match your search. Try a different search or clear your filters.'
                            : 'This community is just getting started. Post a question and kick things off!'
                        }
                    </p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
