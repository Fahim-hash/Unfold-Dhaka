import type { Metadata } from 'next';
import 'maplibre-gl/dist/maplibre-gl.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Unfold Dhaka — Explore Greater Dhaka in 3D',
  description: 'Explore Greater Dhaka on an immersive 3D map. Discover places, save favourites and plan walking routes across the city.',
  metadataBase: new URL('https://unfold-dhaka-relaxteam.vercel.app'),
  alternates: { canonical: '/' },
  openGraph: { title: 'Unfold Dhaka — Explore Greater Dhaka in 3D', description: 'Discover places and plan journeys on an immersive 3D city map.', type: 'website' },
  robots: { index: true, follow: true }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
