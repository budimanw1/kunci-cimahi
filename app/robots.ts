import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kunci-cimahi.vercel.app'
    const sitemapUrl = baseUrl.endsWith('/') ? `${baseUrl}sitemap.xml` : `${baseUrl}/sitemap.xml`

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api'],
        },
        sitemap: sitemapUrl,
    }
}
