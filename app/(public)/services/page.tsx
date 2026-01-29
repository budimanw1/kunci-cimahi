import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ServiceCard } from '@/components/service-card'
import { Key, Bike, Car, Home, Wrench, Lock, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { Service } from '@/lib/types'

export const metadata: Metadata = generateMetadata({
    title: 'Layanan',
    description: 'Daftar lengkap layanan tukang kunci KUNCI-CIMAHI: duplikat kunci motor, mobil, rumah, kunci hilang, patah, terkunci. Harga terjangkau, layanan 24/7.',
    path: '/services',
})

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

export default async function ServicesPage() {
    const { data: services } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true })
        .order('price', { ascending: true })

    return (
        <div className="py-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Layanan Kami</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Solusi lengkap untuk semua kebutuhan kunci Anda dengan harga terjangkau dan layanan profesional
                    </p>
                </div>

                {/* Services Grid */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Layanan Utama</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services && services.length > 0 ? (
                            services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    icon={getServiceIcon(service)}
                                    name={service.title}
                                    description={service.description}
                                    priceStart={service.price}
                                    estimatedTime={service.estimated_time}
                                    category={service.category}
                                />
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-8 text-muted-foreground">
                                Belum ada layanan yang ditambahkan.
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing Table */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6">Daftar Harga</h2>
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Layanan</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Harga Mulai</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Estimasi Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {services && services.length > 0 ? (
                                            services.map((service) => (
                                                <tr key={service.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium">{service.title}</td>
                                                    <td className="px-6 py-4 font-semibold text-gold-600">
                                                        Rp {service.price.toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground">{service.estimated_time}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-4 text-center text-muted-foreground">
                                                    Data harga belum tersedia
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                    <p className="text-sm text-muted-foreground mt-4">
                        * Harga dapat bervariasi tergantung jenis kendaraan dan tingkat kesulitan. Hubungi kami untuk informasi lebih lanjut.
                    </p>
                </div>

                {/* Why Choose Us */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Mengapa Memilih Kami?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Shield className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Teknisi Berpengalaman</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Dikerjakan oleh teknisi profesional dengan pengalaman bertahun-tahun
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gold-100 rounded-lg">
                                        <Key className="h-6 w-6 text-gold-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Peralatan Modern</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Menggunakan peralatan dan teknologi terkini untuk hasil terbaik
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <Wrench className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Harga Terjangkau</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Harga kompetitif dan transparan tanpa biaya tersembunyi
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <Lock className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Garansi Layanan</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Kami memberikan garansi untuk setiap pekerjaan yang kami lakukan
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
