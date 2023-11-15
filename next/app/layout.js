import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import './globals.css'
import { AuthProvider } from './contexts/AuthContext'
import { RenderProvider } from './contexts/RenderContext'
import { ContentProvider } from './contexts/ContentContext'
import { FormProvider } from './contexts/FormContext'
import { NotificationProvider } from './contexts/NotificationContext'
import Notification from './components/Notification'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StudyBuddy',
  description: 'Find your herd',
}

export default function RootLayout({ children }) {

  return (
    <AuthProvider> 
      <RenderProvider>
        <NotificationProvider>
          <ContentProvider>
            <FormProvider>
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <Notification />
        {children}</body>
    </html>
            </FormProvider>
          </ContentProvider>
        </NotificationProvider>
      </RenderProvider>
    </AuthProvider>
  )
}
