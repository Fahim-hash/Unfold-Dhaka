import type { Metadata } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';
export const metadata: Metadata = { title: 'Unfold Dhaka — Discover the city, slowly', description: 'Explore Greater Dhaka through maps, places, neighbourhoods, food, heritage and curated journeys.', metadataBase: new URL('https://unfold-dhaka.vercel.app'), alternates: { canonical: '/' }, openGraph: { title: 'Unfold Dhaka', description: 'A living guide to Greater Dhaka.', type: 'website' }, robots: { index: true, follow: true } };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
