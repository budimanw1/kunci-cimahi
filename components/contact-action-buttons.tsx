'use client'

import { Button } from '@/components/ui/button'
import { Phone, MessageCircle } from 'lucide-react'

interface ContactActionButtonsProps {
    whatsappNumber: string
    businessPhone: string
}

export function ContactActionButtons({ whatsappNumber, businessPhone }: ContactActionButtonsProps) {
    const handleWhatsApp = () => {
        const message = encodeURIComponent('🔑 Halo KUNCI-CIMAHI! Saya butuh bantuan tukang kunci.')
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
    }

    const handleCall = () => {
        window.location.href = `tel:${businessPhone}`
    }

    const handleSMS = () => {
        window.location.href = `sms:${businessPhone}`
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
                onClick={handleWhatsApp}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white h-auto py-4"
            >
                <div className="flex flex-col items-center gap-2">
                    <MessageCircle className="h-8 w-8" />
                    <span className="font-semibold">WhatsApp</span>
                    <span className="text-xs">Respon Cepat</span>
                </div>
            </Button>
            <Button
                onClick={handleCall}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white h-auto py-4"
            >
                <div className="flex flex-col items-center gap-2">
                    <Phone className="h-8 w-8" />
                    <span className="font-semibold">Telepon</span>
                    <span className="text-xs">Langsung Bicara</span>
                </div>
            </Button>
            <Button
                onClick={handleSMS}
                size="lg"
                variant="outline"
                className="h-auto py-4 border-2"
            >
                <div className="flex flex-col items-center gap-2">
                    <MessageCircle className="h-8 w-8" />
                    <span className="font-semibold">SMS</span>
                    <span className="text-xs">Kirim Pesan</span>
                </div>
            </Button>
        </div>
    )
}
