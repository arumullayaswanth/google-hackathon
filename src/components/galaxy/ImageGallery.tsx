
'use client';

import { getQuestionsWithImages } from '@/lib/store';
import type { Question } from '@/types';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  

export function ImageGallery() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getQuestionsWithImages().then(data => {
            setQuestions(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                 <div>
                    <h1 className="text-3xl font-bold tracking-tight">Galaxy View</h1>
                    <p className="text-muted-foreground mt-2">
                        A visual gallery of all images shared by the community.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-bold tracking-tight">Galaxy View</h1>
                <p className="text-muted-foreground mt-2">
                    A visual gallery of all images shared by the community.
                </p>
            </div>
            {questions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {questions.map(question => (
                        <Dialog key={question.id}>
                            <DialogTrigger asChild>
                                <Card className="overflow-hidden cursor-pointer group">
                                    <div className="relative w-full h-64">
                                        <Image 
                                            src={question.imageUrl!} 
                                            alt={question.title} 
                                            layout="fill" 
                                            objectFit="cover"
                                            className="group-hover:scale-105 transition-transform duration-300"
                                        />
                                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                    </div>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                    <DialogTitle>{question.title}</DialogTitle>
                                    <DialogDescription>
                                        Posted by {question.author.displayName}. <Link href={`/questions/${question.id}`} className="text-primary hover:underline">View question</Link>.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="relative w-full h-[70vh]">
                                    <Image src={question.imageUrl!} alt={question.title} layout="fill" objectFit="contain" />
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <h3 className="text-xl font-semibold mb-2">The Galaxy is Empty</h3>
                        <p className="text-muted-foreground">
                            No images have been posted yet. Be the first to share one!
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
