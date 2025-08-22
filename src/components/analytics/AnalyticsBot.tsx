'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, User } from 'lucide-react';
import { getAnalyticsBotAnswer } from '@/app/actions';
import type { AnalyticsData } from '@/types';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { Avatar, AvatarFallback } from '../ui/avatar';


interface AnalyticsBotProps {
    analyticsData: AnalyticsData;
}

export function AnalyticsBot({ analyticsData }: AnalyticsBotProps) {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState<{role: 'user' | 'bot', content: string}[]>([]);

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { role: 'user' as const, content: inputValue };
        setConversation(prev => [...prev, userMessage]);
        setIsLoading(true);
        setInputValue('');

        const botResponse = await getAnalyticsBotAnswer(inputValue, analyticsData);
        
        const botMessage = { role: 'bot' as const, content: botResponse };
        setConversation(prev => [...prev, botMessage]);
        setIsLoading(false);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ask AI Assistant</CardTitle>
                <CardDescription>Ask questions about the analytics data in natural language.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="h-64 overflow-y-auto p-4 border rounded-md space-y-4 bg-muted/50">
                        {conversation.length === 0 && (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p>Ask something like "Which topic is most popular?"</p>
                            </div>
                        )}
                        {conversation.map((entry, index) => (
                             <div key={index} className={`flex items-start gap-3 ${entry.role === 'user' ? 'justify-end' : ''}`}>
                                {entry.role === 'bot' && (
                                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
                                        <Bot className="h-5 w-5" />
                                    </Avatar>
                                )}
                                <div className={`rounded-lg p-3 max-w-[80%] ${entry.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                                    <MarkdownRenderer content={entry.content} />
                                </div>
                                 {entry.role === 'user' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
                                    <Bot className="h-5 w-5" />
                                </Avatar>
                                <div className="rounded-lg p-3 bg-background flex items-center">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleQuestionSubmit} className="flex gap-2">
                        <Input 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about the data..."
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                            {isLoading ? 'Thinking...' : 'Ask'}
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    )
}
