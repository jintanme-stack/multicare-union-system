import './globals.css';
import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata = {
  title: 'MultiCare Support Malaysia Union',
  description: 'Private Care Management SaaS Platform for Registered Union Members',
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
