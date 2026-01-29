'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { Testimonial } from '@/lib/types'

interface TestimonialCarouselProps {
    testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [testimonials.length])

    if (!testimonials || testimonials.length === 0) {
        return null
    }

    const currentTestimonial = testimonials[currentIndex]

    return (
        <div className="relative max-w-4xl mx-auto">
            <Card className="border-2 border-gold-400">
                <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${i < currentTestimonial.rating
                                    ? 'fill-gold-500 text-gold-500'
                                    : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-lg italic mb-6">&quot;{currentTestimonial.comment}&quot;</p>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{currentTestimonial.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{currentTestimonial.location}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {currentTestimonial.service_type}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-8 bg-gold-500' : 'w-2 bg-gray-300'
                            }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
