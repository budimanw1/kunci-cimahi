import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ServiceCard } from '@/components/service-card'
import { Key, Bike, Car, Home, Wrench, Lock, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = generateMetadata({
    title: 'Layanan',
    description: 'Daftar lengkap layanan tukang kunci KUNCI-CIMAHI: duplikat kunci motor, mobil, rumah, kunci hilang, patah, terkunci. Harga terjangkau, layanan 24/7.',
    path: '/services',
})

export default function ServicesPage() {
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
                        <ServiceCard
                            icon={Bike}
                            name="Duplikat Kunci Motor"
                            description="Pembuatan kunci motor duplikat semua merk (Honda, Yamaha, Suzuki, dll)"
                            priceStart={25000}
                            estimatedTime="10 menit"
                            category="motor"
                        />
                        <ServiceCard
                            icon={Car}
                            name="Duplikat Kunci Mobil"
                            description="Duplikat kunci mobil dengan teknologi terkini, semua merk"
                            priceStart={75000}
                            estimatedTime="20 menit"
                            category="mobil"
                        />
                        <ServiceCard
                            icon={Home}
                            name="Kunci Rumah"
                            description="Pembuatan dan perbaikan kunci rumah, pintu, pagar"
                            priceStart={50000}
                            estimatedTime="15 menit"
                            category="rumah"
                        />
                        <ServiceCard
                            icon={Key}
                            name="Kunci Hilang"
                            description="Pembuatan kunci baru untuk kendaraan atau rumah yang kuncinya hilang"
                            priceStart={50000}
                            estimatedTime="20 menit"
                            category="motor"
                        />
                        <ServiceCard
                            icon={Wrench}
                            name="Kunci Patah"
                            description="Ekstraksi kunci patah dari lubang kunci tanpa merusak"
                            priceStart={50000}
                            estimatedTime="15 menit"
                            category="motor"
                        />
                        <ServiceCard
                            icon={Lock}
                            name="Kunci Terkunci"
                            description="Membuka kunci yang terkunci di dalam kendaraan atau rumah"
                            priceStart={75000}
                            estimatedTime="15 menit"
                            category="motor"
                        />
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
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4">Duplikat Kunci Motor</td>
                                            <td className="px-6 py-4 font-semibold text-gold-600">Rp25.000</td>
                                            <td className="px-6 py-4">10 menit</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4">Duplikat Kunci Mobil</td>
                                            <td className="px-6 py-4 font-semibold text-gold-600">Rp75.000</td>
                                            <td className="px-6 py-4">20 menit</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4">Kunci Rumah Hilang</td>
                                            <td className="px-6 py-4 font-semibold text-gold-600">Rp75.000</td>
                                            <td className="px-6 py-4">30 menit</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4">Kunci Patah Ekstraksi</td>
                                            <td className="px-6 py-4 font-semibold text-gold-600">Rp50.000</td>
                                            <td className="px-6 py-4">15 menit</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4">Kunci Terkunci di Jok</td>
                                            <td className="px-6 py-4 font-semibold text-gold-600">Rp75.000</td>
                                            <td className="px-6 py-4">15 menit</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4">Duplikat Kunci Rumah</td>
                                            <td className="px-6 py-4 font-semibold text-gold-600">Rp50.000</td>
                                            <td className="px-6 py-4">15 menit</td>
                                        </tr>
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
