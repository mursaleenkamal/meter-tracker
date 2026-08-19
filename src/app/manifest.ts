import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Read Meter - Smart Electricity Tracker',
    short_name: 'Read Meter',
    description: 'Smart electricity meter and unit consumption tracker with AI OCR scanner and billing cycle insights.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#060913',
    theme_color: '#060913',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['utilities', 'productivity', 'finance'],
  }
}
