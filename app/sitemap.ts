import type { MetadataRoute } from 'next';
import { readings } from '../lib/content';

const baseUrl = 'https://www.studionichiren.it';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['/', '/studio', '/biblioteca', '/glossario', '/progetto', '/regolamento', '/community'];
  return [
    ...staticPaths.map((path) => ({
      url: new URL(path, baseUrl).toString(),
      changeFrequency: (path === '/' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: path === '/' ? 1 : path === '/studio' || path === '/biblioteca' ? 0.8 : 0.5,
    })),
    ...readings.map(({ slug }) => ({
      url: new URL(`/insegnamenti/${slug}`, baseUrl).toString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
