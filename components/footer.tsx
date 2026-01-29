import Link from 'next/link'
import { Key, MapPin, Phone, Mail, Clock } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-gold-500 rounded-lg">
                                <Key className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg leading-none text-white">KUNCI-CIMAHI</span>
                                <span className="text-xs">Layanan 24/7</span>
                            </div>
                        </div>
                        <p className="text-sm">
                            Tukang kunci terpercaya di Cimahi Selatan. Siap melayani kebutuhan kunci Anda kapan saja.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Menu</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-gold-400 transition-colors">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/layanan" className="text-gray-400 hover:text-white transition-colors">
                                    Layanan
                                </Link>
                            </li>
                            <li>
                                <Link href="/pesan" className="text-gray-400 hover:text-white transition-colors">
                                    Pesan
                                </Link>
                            </li>
                            <li>
                                <Link href="/kontak" className="text-gray-400 hover:text-white transition-colors">
                                    Kontak
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Layanan</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Duplikat Kunci Motor</li>
                            <li>Duplikat Kunci Mobil</li>
                            <li>Kunci Rumah</li>
                            <li>Kunci Hilang</li>
                            <li>Kunci Patah</li>
                            <li>Kunci Terkunci</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Kontak</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>Bundaran Leuwigajah, Cimahi Selatan, Kota Cimahi</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <span>{process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+62 xxx xxxx xxxx'}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock className="h-4 w-4 flex-shrink-0" />
                                <span>24 Jam / 7 Hari</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                    <p>&copy; {new Date().getFullYear()} KUNCI-CIMAHI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
