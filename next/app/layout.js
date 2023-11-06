import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import './globals.css'
import { AuthProvider } from './contexts/AuthContext'
import { RenderProvider } from './contexts/RenderContext'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StudyBuddy',
  description: 'Find your herd',
}

export default function RootLayout({ children }) {

  return (
    <AuthProvider> 
      <RenderProvider>
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}</body>
    </html>
    </RenderProvider>
    </AuthProvider>
  )
}
