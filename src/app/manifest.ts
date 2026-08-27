import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Varindo Lamitak',
    short_name: 'Varindo',
    description: 'Katalog resmi HPL Lamitak dari Varindo.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#faf8f5',
    theme_color: '#1a1714',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icons/varindo-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/varindo-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
}
