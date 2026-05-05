import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meridian — Supply Chain Intelligence',
  description: 'Real-time supply chain risk monitoring powered by FRED + SEC EDGAR',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
