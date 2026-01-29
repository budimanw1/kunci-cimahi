import { MetadataRoute } from 'next'
import { AREAS } from '@/lib/utils'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kunci-cimahi.vercel.app'
    const lastModified = new Date()

    const routes = [
        '',
        '/layanan',
        '/pesan',
        '/kontak',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: (route === '' || route === '/pesan' ? 'daily' : 'weekly') as any,
        priority: route === '' ? 1 : 0.8,
    }))

    const areaRoutes = AREAS.map((area) => ({
        url: `${baseUrl}/layanan/${area.slug}`,
        lastModified,
        changeFrequency: 'weekly' as any,
        priority: 0.7,
    }))

    return [...routes, ...areaRoutes]
}
