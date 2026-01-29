'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'

function BookingSuccessContent() {
    const searchParams = useSearchParams()
    const ticketId = searchParams.get('ticket')

    const handleWhatsApp = () => {
        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '62xxxxxxxxxx'
        const message = encodeURIComponent(
            `Halo, saya ingin menanyakan status booking saya dengan Tiket ID: ${ticketId}`
        )
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-green-100 rounded-full">
                        <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                </div>
                <CardTitle className="text-3xl">Booking Berhasil!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                        Terima kasih telah memesan layanan KUNCI-CIMAHI
                    </p>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 inline-block">
                        <p className="text-sm text-muted-foreground mb-2">Nomor Tiket Anda:</p>
                        <p className="text-3xl font-bold text-blue-600">{ticketId}</p>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-3 text-yellow-900">Langkah Selanjutnya:</h3>
                    <ol className="space-y-2 text-sm text-yellow-800 list-decimal list-inside">
                        <li>Simpan nomor tiket Anda untuk referensi</li>
                        <li>Teknisi kami akan menghubungi Anda melalui WhatsApp dalam 5-10 menit</li>
                        <li>Pastikan nomor WhatsApp Anda aktif dan dapat dihubungi</li>
                        <li>Teknisi akan mengkonfirmasi lokasi dan estimasi waktu kedatangan</li>
                    </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        onClick={handleWhatsApp}
                        variant="default"
                        size="lg"
                        className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Chat WhatsApp
                    </Button>
                    <Link href="/" className="flex-1">
                        <Button variant="outline" size="lg" className="w-full">
                            Kembali ke Beranda
                        </Button>
                    </Link>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    <p>Butuh bantuan? Hubungi kami di:</p>
                    <p className="font-semibold text-foreground mt-1">
                        {process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+62 xxx xxxx xxxx'}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default function BookingSuccessPage() {
    return (
        <div className="py-16 bg-gray-50 min-h-screen flex items-center">
            <div className="container mx-auto px-4">
                <Suspense fallback={
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                }>
                    <BookingSuccessContent />
                </Suspense>
            </div>
        </div>
    )
}
