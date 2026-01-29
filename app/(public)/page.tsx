import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ServiceCard } from '@/components/service-card'
import { TestimonialCarousel } from '@/components/testimonial-carousel'
import { Key, Clock, MapPin, Phone, Wrench, Home, Car, Bike, Lock, Shield } from 'lucide-react'
import { Testimonial, Service } from '@/lib/types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { generateFAQSchema } from '@/lib/metadata'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = generateMetadata({
    title: 'Tukang Kunci Cimahi 24 Jam',
    description: 'Jasa tukang kunci panggilan 24 jam di Cimahi Selatan & Leuwigajah. Ahli kunci motor, mobil, immobilizer, dan brankas. Teknisi profesional datang ke lokasi.',
    path: '/',
})

const faqs = [
    {
        question: 'Apakah layanan ini buka 24 jam?',
        answer: 'Ya, kami melayani panggilan darurat 24 jam setiap hari, termasuk hari libur dan tanggal merah untuk area Cimahi Selatan dan sekitarnya.',
    },
    {
        question: 'Berapa lama teknisi akan sampai ke lokasi?',
        answer: 'Untuk area Leuwigajah dan Cimahi Selatan, teknisi kami biasanya tiba dalam waktu 15-30 menit tergantung kondisi lalu lintas.',
    },
    {
        question: 'Apakah bisa membuka kunci mobil tanpa merusak?',
        answer: 'Tentu saja. Teknisi kami menggunakan peralatan khusus (Lishi tools) untuk membuka pintu mobil yang terkunci tanpa merusak pintu atau sistem kunci kendaraan Anda.',
    },
    {
        question: 'Berapa kisaran biaya untuk duplikat kunci?',
        answer: 'Harga duplikat kunci motor mulai dari Rp 25.000, sedangkan mobil mulai dari Rp 75.000 (non-immobilizer). Untuk kunci immobilizer harga menyesuaikan jenis chip.',
    },
    {
        question: 'Area mana saja yang dijangkau?',
        answer: 'Fokus utama kami adalah Cimahi Selatan (Leuwigajah, Cibeber, Utama, Melong) namun kami juga melayani area Cimahi Tengah, Cimahi Utara, dan perbatasan Bandung Barat.',
    },
]

// Mock testimonials - in production, fetch from Supabase
const testimonials: Testimonial[] = [
    {
        id: '1',
        customer_name: 'Budi Santoso',
        location: 'Leuwigajah',
        rating: 5,
        comment: 'Pelayanan cepat dan profesional! Kunci motor saya yang hilang langsung dibuatkan duplikat dalam 15 menit. Harga terjangkau.',
        service_type: 'Duplikat Kunci Motor',
        created_at: new Date().toISOString(),
        is_active: true,
    },
    {
        id: '2',
        customer_name: 'Siti Nurhaliza',
        location: 'Cimahi Selatan',
        rating: 5,
        comment: 'Sangat membantu! Kunci rumah saya patah di lubang kunci, teknisinya datang cepat dan berhasil mengeluarkan tanpa merusak pintu.',
        service_type: 'Kunci Patah',
        created_at: new Date().toISOString(),
        is_active: true,
    },
    {
        id: '3',
        customer_name: 'Ahmad Hidayat',
        location: 'Bundaran Leuwigajah',
        rating: 5,
        comment: 'Layanan 24 jam benar-benar bisa diandalkan. Tengah malam kunci mobil tertinggal di dalam, langsung ditangani dengan baik.',
        service_type: 'Kunci Terkunci',
        created_at: new Date().toISOString(),
        is_active: true,
    },
]

// Helper to get icon based on category/name
const getServiceIcon = (service: Service) => {
    const title = service.title.toLowerCase()
    const category = service.category.toLowerCase()

    if (title.includes('motor')) return Bike
    if (title.includes('mobil')) return Car
    if (title.includes('rumah')) return Home
    if (title.includes('brankas')) return Shield
    if (title.includes('patah')) return Wrench
    if (title.includes('hilang')) return Key

    if (category === 'motor') return Bike
    if (category === 'mobil') return Car
    if (category === 'rumah') return Home

    return Key
}

export const revalidate = 0 // Disable cache for real-time updates

export default async function HomePage() {
    // Fetch Services
    const { data: services } = await supabase
        .from('services')
        .select('*')
        .limit(4)
        .order('created_at', { ascending: true })

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-gold-500/20 backdrop-blur-sm border border-gold-400/30 rounded-full px-4 py-2 mb-6">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">Layanan 24/7 - Siap Membantu Kapan Saja</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Tukang Kunci Terpercaya di{' '}
                            <span className="text-gold-400">Cimahi Selatan</span>
                        </h1>

                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Duplikat Kunci • Kunci Hilang • Kunci Patah • Kunci Terkunci
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link href="/pesan">
                                <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-black font-bold text-lg h-14 px-8 shadow-gold">
                                    <Key className="mr-2 h-5 w-5" />
                                    Pesan Sekarang
                                </Button>
                            </Link>
                            <Link href="/layanan">
                                <Button variant="outline" size="xl" className="w-full sm:w-auto hover:bg-white/10">
                                    Lihat Semua Layanan
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gold-400" />
                            <span>Jl. Mahar Martanegara No.218, Utama, Cimahi Selatan</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                                <Clock className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Layanan 24/7</h3>
                            <p className="text-muted-foreground">
                                Siap melayani kebutuhan kunci Anda kapan saja, bahkan tengah malam
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex p-4 bg-gold-100 rounded-full mb-4">
                                <Wrench className="h-8 w-8 text-gold-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Teknisi Profesional</h3>
                            <p className="text-muted-foreground">
                                Dikerjakan oleh teknisi berpengalaman dan terpercaya
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                                <MapPin className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Lokasi Strategis</h3>
                            <p className="text-muted-foreground">
                                Berlokasi di Jl. Mahar Martanegara, Utama, Cimahi Selatan
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Layanan Kami</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Solusi lengkap untuk semua kebutuhan kunci Anda dengan harga terjangkau
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services && services.length > 0 ? (
                            services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    icon={getServiceIcon(service)}
                                    name={service.title}
                                    description={service.description}
                                    priceStart={service.price}
                                    estimatedTime={service.estimated_time || '15 menit'}
                                    category={service.category}
                                />
                            ))
                        ) : (
                            // Fallback if no services in DB
                            <>
                                <ServiceCard
                                    icon={Bike}
                                    name="Duplikat Kunci Motor"
                                    description="Pembuatan kunci motor duplikat semua merk"
                                    priceStart={25000}
                                    estimatedTime="10 menit"
                                    category="motor"
                                />
                                <ServiceCard
                                    icon={Car}
                                    name="Duplikat Kunci Mobil"
                                    description="Duplikat kunci mobil dengan teknologi terkini"
                                    priceStart={75000}
                                    estimatedTime="20 menit"
                                    category="mobil"
                                />
                            </>
                        )}
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/services">
                            <Button variant="outline" size="lg">
                                Lihat Semua Layanan
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Lokasi Kami</h2>
                        <p className="text-lg text-muted-foreground">
                            Jl. Mahar Martanegara No.218, Utama, Cimahi Selatan
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d990.224233580919!2d107.53565228970128!3d-6.902927518682059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e5d2e0679eed%3A0x360a44c9ee0eb336!2sJl.%20Mahar%20Martanegara%20No.218%2C%20Utama%2C%20Kec.%20Cimahi%20Sel.%2C%20Kota%20Cimahi%2C%20Jawa%20Barat%2040533!5e0!3m2!1sid!2sid!4v1769685139633!5m2!1sid!2sid"
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
                                href="https://maps.app.goo.gl/qaLNzD3tJQsCq4xX7"
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
            </section>

            {/* Testimonials Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Testimoni Pelanggan</h2>
                        <p className="text-lg text-muted-foreground">
                            Apa kata pelanggan kami di Cimahi
                        </p>
                    </div>

                    <TestimonialCarousel testimonials={testimonials} />
                </div>
            </section>

            {/* FAO Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Pertanyaan Umum (FAQ)</h2>
                        <p className="text-lg text-muted-foreground">
                            Hal yang sering ditanyakan pelanggan kami
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left font-semibold">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateFAQSchema(faqs)),
                }}
            />

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Butuh Bantuan Sekarang?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Hubungi kami kapan saja, kami siap membantu 24/7
                    </p>
                    <Link href="/pesan">
                        <Button variant="gold" size="xl" className="shadow-lg hover:shadow-xl">
                            <Phone className="mr-2 h-5 w-5" />
                            Hubungi Sekarang
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}

