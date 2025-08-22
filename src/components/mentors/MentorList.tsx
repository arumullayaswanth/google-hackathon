
'use client';

import { getMentors } from '@/lib/store';
import type { User } from '@/types';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck } from 'lucide-react';

export function MentorList() {
    const [mentors, setMentors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMentors().then(data => {
            setMentors(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hackathon Mentors</h1>
                <p className="text-muted-foreground mt-2">
                    These experts are here to help you during the hackathon. Feel free to reach out!
                </p>
            </div>
            {mentors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {mentors.map(mentor => (
                        <Card key={mentor.uid} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-col items-center text-center p-6">
                                <Avatar className="h-24 w-24 border-4 border-primary mb-4">
                                    <AvatarImage src={mentor.photoURL || ''} alt={mentor.displayName || ''} data-ai-hint="person avatar" />
                                    <AvatarFallback>{mentor.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <CardTitle className="flex items-center justify-center gap-2">
                                        {mentor.displayName?.split('(')[0].trim()}
                                        <ShieldCheck className="h-5 w-5 text-blue-500" />
                                    </CardTitle>
                                    {mentor.displayName?.includes('(') && (
                                        <CardDescription className="text-primary font-medium">
                                            {mentor.displayName?.split('(')[1].replace(')', '')}
                                        </CardDescription>
                                    )}
                                </div>
                                <CardDescription className="mt-2">{mentor.score} reputation</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : (
                <p>No mentors are currently listed.</p>
            )}
        </div>
    )
}
