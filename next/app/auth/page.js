'use client'
import { useAuthContext } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const { user, setUser } = useAuthContext()
    const router = useRouter()
    if (user !== null) {
        return router.push('/')
    }
    else {
        return router.push('/auth/login')
    }
}