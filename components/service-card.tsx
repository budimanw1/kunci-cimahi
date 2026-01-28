'use client'

import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/supabase'
import Link from 'next/link'

interface ServiceCardProps {
    icon: LucideIcon
    name: string
    description: string
    priceStart: number
    estimatedTime: string
    category: string
}

export function ServiceCard({
    icon: Icon,
    name,
    description,
    priceStart,
    estimatedTime,
    category,
}: ServiceCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-gold-400">
            <CardHeader>
                <div className="mb-4 p-3 bg-gradient-to-br from-blue-500 to-gold-500 rounded-lg w-fit">
                    <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{name}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Mulai dari:</span>
                        <span className="text-lg font-bold text-gold-600">
                            {formatCurrency(priceStart)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Estimasi:</span>
                        <span className="text-sm font-medium">{estimatedTime}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Link href="/booking" className="w-full">
                    <Button variant="gold" className="w-full">
                        Pesan Sekarang
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
