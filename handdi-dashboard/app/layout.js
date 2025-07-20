import './globals.css'

export const metadata = {
  title: 'Handdi.io - Agent Leaderboard',
  description: 'Real estate agent leaderboard tracking referral earnings and performance metrics',
  keywords: 'real estate, agents, leaderboard, referrals, handdi',
  authors: [{ name: 'Handdi.io' }],
  openGraph: {
    title: 'Handdi.io Agent Leaderboard',
    description: 'Track top performing real estate agents by referral earnings',
    type: 'website',
    locale: 'en_US',
    siteName: 'Handdi.io',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Handdi.io Agent Leaderboard',
    description: 'Track top performing real estate agents by referral earnings',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#FCD34D',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
} 