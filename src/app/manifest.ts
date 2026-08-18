import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Read Meter - Smart Electricity Tracker',
    short_name: 'Read Meter',
    description: 'Smart electricity meter and unit consumption tracker with AI OCR scanner and billing cycle insights.',
    start_url: '/',
    display: 'standalone',
    background_color: '#060913',
    theme_color: '#00f0ff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['utilities', 'productivity', 'finance'],
  }
}
