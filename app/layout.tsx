import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

const amxFont = localFont({
  src: [
    {
      path: '../public/fonts/AMX-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/AMX-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/AMX-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/AMX-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-amx',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${amxFont.variable} ${inter.variable}`}>
      <body className={amxFont.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
