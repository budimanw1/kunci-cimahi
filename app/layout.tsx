import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { generateMetadata, generateLocalBusinessSchema } from '@/lib/metadata'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    ...generateMetadata(),
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const schema = generateLocalBusinessSchema()

    return (
        <html lang="id">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            </head>
            <body className={inter.className}>
                {children}
            </body>
        </html>
    )
}
