import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { BookingForm } from '@/components/booking-form'

export const metadata: Metadata = generateMetadata({
    title: 'Booking',
    description: 'Pesan layanan tukang kunci KUNCI-CIMAHI sekarang. Isi formulir dan teknisi kami akan segera menghubungi Anda. Layanan 24/7.',
    path: '/pesan',
})

export default function BookingPage() {
    return (
        <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Pesan Layanan</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Isi formulir di bawah ini dan teknisi kami akan segera menghubungi Anda
                    </p>
                </div>

                <BookingForm />

                <div className="max-w-2xl mx-auto mt-12">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-semibold mb-3 text-blue-900">Informasi Penting:</h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Setelah mengirim formulir, Anda akan menerima nomor tiket booking</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Teknisi kami akan menghubungi Anda melalui WhatsApp dalam 5-10 menit</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Pastikan nomor WhatsApp yang Anda masukkan aktif dan dapat dihubungi</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Untuk layanan darurat, Anda dapat langsung menghubungi kami via WhatsApp</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
