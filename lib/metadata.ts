import { Metadata } from 'next'

const siteConfig = {
    name: 'KUNCI-CIMAHI',
    description: 'Layanan Tukang Kunci 24/7 di Cimahi Selatan - Bundaran Leuwigajah. Duplikat kunci motor, mobil, rumah. Kunci hilang, patah, terkunci. Panggil sekarang!',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kunci-cimahi.vercel.app',
    businessName: 'KUNCI-CIMAHI',
    address: 'Bundaran Leuwigajah, Cimahi Selatan, Kota Cimahi, Jawa Barat',
    phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+62 xxx xxxx xxxx',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '62xxxxxxxxxx',
}

export function generateMetadata(page?: {
    title?: string
    description?: string
    path?: string
}): Metadata {
    const title = page?.title
        ? `${page.title} | ${siteConfig.name}`
        : `${siteConfig.name} - Tukang Kunci 24/7 Cimahi Selatan`

    const description = page?.description || siteConfig.description
    const url = page?.path
        ? `${siteConfig.url}${page.path}`
        : siteConfig.url

    return {
        title,
        description,
        keywords: [
            'tukang kunci cimahi',
            'kunci motor cimahi',
            'duplikat kunci cimahi',
            'kunci hilang cimahi',
            'tukang kunci 24 jam',
            'leuwigajah',
            'cimahi selatan',
            'kunci patah',
            'kunci terkunci',
            'ahli kunci',
        ],
        authors: [{ name: siteConfig.businessName }],
        creator: siteConfig.businessName,
        publisher: siteConfig.businessName,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: url,
        },
        openGraph: {
            type: 'website',
            locale: 'id_ID',
            url,
            title,
            description,
            siteName: siteConfig.name,
            images: [
                {
                    url: '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: siteConfig.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/og-image.jpg'],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            google: 'RTabTLce6yd0HHOnFrqN6fCIyNVtHS-NexghMjfq2a0',
        },
    }
}

export function generateLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Locksmith',
        name: siteConfig.businessName,
        description: siteConfig.description,
        url: siteConfig.url,
        telephone: siteConfig.phone,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Bundaran Leuwigajah',
            addressLocality: 'Cimahi Selatan',
            addressRegion: 'Jawa Barat',
            addressCountry: 'ID',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: -6.8926,
            longitude: 107.5426,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ],
            opens: '00:00',
            closes: '23:59',
        },
        priceRange: 'Rp25.000 - Rp150.000',
        areaServed: {
            '@type': 'City',
            name: 'Cimahi',
        },
        serviceType: [
            'Duplikat Kunci Motor',
            'Duplikat Kunci Mobil',
            'Kunci Rumah',
            'Kunci Hilang',
            'Kunci Patah',
            'Kunci Terkunci',
        ],
    }
}

export { siteConfig }
