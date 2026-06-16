import './globals.css';
import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata = {
  title: 'MultiCare Support Malaysia Union',
  description: 'Private Care Management SaaS Platform for Registered Union Members',
  manifest: '/manifest.json',
  icons: {
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#3B82F6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
