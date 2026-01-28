'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Key, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Layanan', href: '/services' },
    { name: 'Booking', href: '/booking' },
    { name: 'Kontak', href: '/contact' },
]

export function Navbar() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-gold-500 rounded-lg">
                            <Key className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-none">KUNCI-CIMAHI</span>
                            <span className="text-xs text-muted-foreground">24/7 Service</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-gold-600',
                                    pathname === item.href
                                        ? 'text-gold-600'
                                        : 'text-gray-700'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link href="/booking">
                            <Button variant="gold" size="sm">
                                Panggil Sekarang
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col gap-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'text-sm font-medium transition-colors hover:text-gold-600 px-2 py-1',
                                        pathname === item.href
                                            ? 'text-gold-600'
                                            : 'text-gray-700'
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="gold" size="sm" className="w-full">
                                    Panggil Sekarang
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
