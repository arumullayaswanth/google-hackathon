
'use client';

import { getAnalyticsData } from '@/lib/store';
import type { AnalyticsData } from '@/types';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AnalyticsBot } from './AnalyticsBot';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnalyticsData().then(data => {
            setAnalytics(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                         <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-12 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-80" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!analytics) {
        return <p>Could not load analytics data.</p>
    }

    const tagData = Object.entries(analytics.tagCounts).map(([name, value]) => ({ name, count: value }));

    const humanAnswers = analytics.totalAnswers - analytics.totalAiAnswers;
    const answerBreakdownData = [
        { name: 'Human Answers', value: humanAnswers },
        { name: 'AI Answers', value: analytics.totalAiAnswers },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Insights into community activity and trends.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="sm:col-span-2 lg:col-span-4">
                     <AnalyticsBot analyticsData={analytics} />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{analytics.totalQuestions}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Answers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{analytics.totalAnswers}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{analytics.totalUsers}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Most Popular Topics</CardTitle>
                        <CardDescription>
                            A look at the most frequently used tags in questions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-80">
                            <ResponsiveContainer>
                                <BarChart data={tagData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Answer Breakdown</CardTitle>
                        <CardDescription>
                            A comparison of answers provided by the community vs. AI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-80">
                           <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={answerBreakdownData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {answerBreakdownData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                           </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
