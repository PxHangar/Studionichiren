import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/auth/', '/quaderno'],
    },
    sitemap: 'https://www.studionichiren.it/sitemap.xml',
    host: 'https://www.studionichiren.it',
  };
}
