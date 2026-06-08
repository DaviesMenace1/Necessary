import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'INTERIO — Luxury Interior Design & Architecture',
  description: 'Bespoke interior design, global material sourcing, and precision installation for discerning clients worldwide.',
  keywords: 'luxury interior design, architecture, material sourcing, bespoke furniture, installation',
  openGraph: {
    title: 'INTERIO — Luxury Interior Design & Architecture',
    description: 'Where extraordinary spaces begin.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="grain antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
