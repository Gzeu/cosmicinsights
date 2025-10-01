import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { DappProvider } from '@multiversx/sdk-dapp/wrappers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GPZ-94 AI Dashboard | AI-Enhanced Smart Contracts',
  description: 'Revolutionary AI-powered smart contract system that interprets natural language instructions and translates them into secure blockchain operations on MultiversX.',
  keywords: [
    'MultiversX',
    'AI',
    'Smart Contracts',
    'Blockchain',
    'Natural Language Processing',
    'Security Auditing',
    'DeFi',
    'Web3'
  ],
  authors: [{ name: 'George Pricop', url: 'https://github.com/Gzeu' }],
  creator: 'George Pricop',
  publisher: 'GPZ-94 Development Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cosmicinsights.vercel.app'),
  openGraph: {
    title: 'GPZ-94 AI Dashboard',
    description: 'AI-Enhanced Smart Contracts for MultiversX',
    url: 'https://cosmicinsights.vercel.app',
    siteName: 'GPZ-94 AI Dashboard',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GPZ-94 AI Dashboard',
    description: 'AI-Enhanced Smart Contracts for MultiversX',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <DappProvider
          environment="devnet"
          customNetworkConfig={{
            name: 'devnet',
            apiTimeout: 6000,
            walletConnectV2ProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''
          }}
          dappConfig={{
            shouldUseWebViewProvider: true,
          }}
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#374151',
                color: '#f3f4f6',
                borderRadius: '0.75rem',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f3f4f6',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f3f4f6',
                },
              },
            }}
          />
        </DappProvider>
      </body>
    </html>
  )
}