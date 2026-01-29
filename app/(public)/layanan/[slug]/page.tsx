import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata'
import { ServiceCard } from '@/components/service-card'
import { Key, Bike, Car, Home, Wrench, Shield, Clock, MapPin, Phone, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Service, Testimonial } from '@/lib/types'
import { AREAS } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    return AREAS.map((area) => ({
        slug: area.slug,
    }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const area = AREAS.find((a) => a.slug === params.slug)

    if (!area) {
        return {
            title: 'Area Tidak Ditemukan',
        }
    }

    return {
        title: `Tukang Kunci ${area.name} 24 Jam - Duplikat & Service`,
        description: `Jasa tukang kunci panggilan di ${area.name} 24 jam. Duplikat kunci motor, mobil, rumah, brankas. Teknisi profesional datang ke lokasi. Hubungi 08xxx.`,
        alternates: {
            canonical: `/layanan/${area.slug}`,
        },
    }
}

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

export const revalidate = 0

export default async function AreaPage(props: Props) {
    const params = await props.params;
    const area = AREAS.find((a) => a.slug === params.slug)

    if (!area) {
        notFound()
    }

    // Fetch Services
    const { data: services } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true })
        .order('price', { ascending: true })

    const faqs = [
        {
            question: `Apakah ada tukang kunci 24 jam di ${area.name}?`,
            answer: `Ya, Kunci Cimahi melayani panggilan darurat 24 jam untuk area ${area.name} dan sekitarnya. Teknisi kami siap datang kapan saja.`,
        },
        {
            question: `Berapa lama teknisi sampai ke ${area.name}?`,
            answer: `Estimasi waktu kedatangan teknisi ke ${area.name} adalah sekitar 15-30 menit, tergantung kondisi lalu lintas saat itu.`,
        },
        {
            question: `Bisakah duplikat kunci immobilizer di ${area.name}?`,
            answer: `Tentu bisa. Kami memiliki peralatan lengkap untuk duplikat kunci mobil immobilizer semua merk untuk pelanggan di ${area.name}.`,
        },
    ]

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 bg-gold-500/20 backdrop-blur-sm border border-gold-400/30 rounded-full px-4 py-2 mb-6">
                        <MapPin className="h-4 w-4 text-gold-400" />
                        <span className="text-sm font-medium">Layanan Panggilan ke {area.name}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Tukang Kunci <span className="text-gold-400">{area.name}</span> 24 Jam
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100">
                        Solusi cepat masalah kunci motor, mobil, dan rumah Anda di {area.name}.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/pesan">
                            <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-black font-bold text-lg h-14 px-8 shadow-gold">
                                <Phone className="mr-2 h-5 w-5" />
                                Panggil Sekarang
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Layanan Kami di {area.name}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Daftar layanan lengkap yang bisa kami kerjakan di lokasi Anda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <div className="col-span-3 text-center py-8 text-muted-foreground">
                                Loading services...
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">FAQ - {area.name}</h2>
                        <p className="text-muted-foreground">
                            Pertanyaan seputar layanan kunci di {area.name}
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

            {/* Why Choose Us */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Keunggulan Kami</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-4">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold mb-2">Respon Cepat</h3>
                                <p className="text-sm text-muted-foreground">Tiba di {area.name} dalam hitungan menit</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto p-3 bg-gold-100 rounded-full w-fit mb-4">
                                    <Wrench className="h-6 w-6 text-gold-600" />
                                </div>
                                <h3 className="font-bold mb-2">Profesional</h3>
                                <p className="text-sm text-muted-foreground">Teknisi ahli dengan peralatan lengkap</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto p-3 bg-green-100 rounded-full w-fit mb-4">
                                    <Shield className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="font-bold mb-2">Bergaransi</h3>
                                <p className="text-sm text-muted-foreground">Semua pengerjaan bergaransi</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto p-3 bg-purple-100 rounded-full w-fit mb-4">
                                    <Lock className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="font-bold mb-2">24 Jam</h3>
                                <p className="text-sm text-muted-foreground">Siap dipanggil kapan saja</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
