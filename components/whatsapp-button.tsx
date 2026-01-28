'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function WhatsAppButton() {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '62xxxxxxxxxx'

    const handleClick = () => {
        const message = encodeURIComponent(
            '🔑 Halo KUNCI-CIMAHI! Saya butuh bantuan tukang kunci.'
        )
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-pulse-slow">
                24/7 Online
            </div>
            <Button
                onClick={handleClick}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-float h-16 w-16 p-0"
                aria-label="Chat WhatsApp"
            >
                <MessageCircle className="h-8 w-8" />
            </Button>
        </div>
    )
}
