import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react'
import { ContactActionButtons } from '@/components/contact-action-buttons'

export const metadata: Metadata = generateMetadata({
    title: 'Kontak',
    description: 'Hubungi KUNCI-CIMAHI untuk layanan tukang kunci 24/7 di Cimahi Selatan. WhatsApp, telepon, atau kunjungi kami di Bundaran Leuwigajah.',
    path: '/contact',
})

export default function ContactPage() {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '62xxxxxxxxxx'
    const businessPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+62 xxx xxxx xxxx'



    return (
        <div className="py-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Kami siap membantu Anda 24 jam sehari, 7 hari seminggu
                    </p>
                </div>

                {/* Emergency Contact Buttons */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold text-red-900 mb-4 text-center">
                            🚨 Layanan Darurat 24/7
                        </h2>
                        <ContactActionButtons whatsappNumber={whatsappNumber} businessPhone={businessPhone} />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Phone className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Telepon</h3>
                                        <p className="text-muted-foreground">{businessPhone}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <MessageCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">WhatsApp</h3>
                                        <p className="text-muted-foreground">+{whatsappNumber}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gold-100 rounded-lg">
                                        <MapPin className="h-6 w-6 text-gold-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Alamat</h3>
                                        <p className="text-muted-foreground">
                                            Bundaran Leuwigajah<br />
                                            Cimahi Selatan, Kota Cimahi<br />
                                            Jawa Barat
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <Clock className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Jam Operasional</h3>
                                        <p className="text-muted-foreground">
                                            24 Jam / 7 Hari<br />
                                            Termasuk Hari Libur
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Map */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Lokasi Kami</h2>
                    <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7234567890123!2d107.5426!3d-6.8926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTMnMzMuNCJTIDEwN8KwMzInMzMuNCJF!5e0!3m2!1sen!2sid!4v1234567890123"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                    <div className="text-center mt-6">
                        <a
                            href="https://maps.google.com/?q=Bundaran+Leuwigajah+Cimahi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            <MapPin className="h-4 w-4" />
                            Buka di Google Maps
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
