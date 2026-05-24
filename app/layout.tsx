import type { Metadata, Viewport } from 'next';
import { Nunito, Rajdhani, Share_Tech_Mono } from 'next/font/google';
import './globals.css';

const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-rajdhani' });
const shareTech = Share_Tech_Mono({ subsets: ['latin'], weight: '400', variable: '--font-share-tech' });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-nunito' });

export const metadata: Metadata = {
  title: 'J.A.R.V.I.S.',
  description: 'Personal AI goal command center',
  manifest: '/manifest.json'
};

export const viewport: Viewport = {
  themeColor: '#0a0f1e',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${rajdhani.variable} ${shareTech.variable} ${nunito.variable}`}>{children}</body>
    </html>
  );
}
