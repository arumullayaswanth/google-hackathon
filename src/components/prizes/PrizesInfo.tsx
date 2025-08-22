'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, Users, Award, Gift, Wifi, Pizza } from 'lucide-react';

export function PrizesInfo() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hackathon Prizes & Info</h1>
                <p className="text-muted-foreground mt-2">
                    Everything you need to know about the prizes, winners, and facilities for this hackathon.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-6 w-6 text-yellow-500" />
                            <span>Grand Prize</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">$10,000</p>
                        <p className="text-muted-foreground">For the overall best project.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-6 w-6 text-slate-400" />
                            <span>Runner Up</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">$5,000</p>
                        <p className="text-muted-foreground">For the second best project.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            <span>Selection</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">1 Grand Prize Winner</p>
                        <p className="text-lg font-semibold">2 Runner Up Teams</p>
                         <p className="text-muted-foreground mt-2">Selected by our panel of expert judges.</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Swag & Facilities</CardTitle>
                    <CardDescription>
                        We've got you covered during the event.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <Gift className="h-5 w-5 text-primary" />
                            <span>Exclusive Hackathon T-Shirt & Stickers</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Wifi className="h-5 w-5 text-primary" />
                            <span>High-speed Wi-Fi</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Pizza className="h-5 w-5 text-primary" />
                            <span>Free meals, snacks, and drinks</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
