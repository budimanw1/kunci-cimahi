import { MetadataRoute } from 'next'
import { AREAS } from '@/lib/utils'

export default function sitemap(): MetadataRoute.Sitemap {
    // Hardcode production URL for maximum stability with GSC
    const baseUrl = 'https://kunci-cimahi.vercel.app'
    const lastModified = new Date('2026-01-29')

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
