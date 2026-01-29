import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { generateLocalBusinessSchema } from '@/lib/metadata'
import Script from 'next/script'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const businessSchema = generateLocalBusinessSchema()

    return (
        <div className="flex flex-col min-h-screen">
            {/* Global Business Schema */}
            <Script
                id="local-business-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
            />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
        </div>
    )
}
