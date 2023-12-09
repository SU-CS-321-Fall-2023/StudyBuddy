import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import './globals.css'
import { AuthProvider } from './contexts/AuthContext'
import { FormProvider } from './contexts/FormContext'
import { NotificationProvider } from './contexts/NotificationContext'
import Notification from './components/Notification'
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StudyBuddy',
  description: 'Find your study buddy!',
}

// TODO: organize routes into (route) directory
// TODO: make folders that aren't meant to be viewed by users private like this "_contexts"
// so that it's not considered by routing features

//TODO: add a loading.js

export default function RootLayout({ children }) {

  return (
    <GoogleOAuthProvider clientId="792093389555-smtmu2ptk96qt3ro324ddbpnm0fjn2tu.apps.googleusercontent.com">
    <AuthProvider> 
        <NotificationProvider>
            <FormProvider>
              <html lang="en">
                <body className={inter.className}>
                  <Navbar />

                    <Notification />
                    {children}
                  </body>
              </html>
            </FormProvider>
        </NotificationProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
  )
}
