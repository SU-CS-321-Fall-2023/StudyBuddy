'use client'
import React from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useFormContext } from '@/app/contexts/FormContext'
import { useAuthContext } from '@/app/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useNotification } from '@/app/contexts/NotificationContext';
import { authController } from '@/app/controllers'

export default function RegisterPage() {
    const { email, setEmail, password, setPassword, name, setName } = useFormContext()
    const { user, setUser } = useAuthContext()
    const router = useRouter()

    const { setNotification } = useNotification()

    if (user !== null ) {
        router.push('/')
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleRegister = async (event) => {
        event.preventDefault()
        try {
            const response = await authController.register({
                name,
                email,
                password
            })
            console.log(response)
            if ((typeof response.user !== 'undefined') && (response.user !== null)) {
                const { user, tokens } = response
                if (window !== undefined) {
                    window.localStorage.setItem('loggedStudyBuddyUser', JSON.stringify(user),)
                }
                setUser(user)
                setEmail('')
                setPassword('')
                setName('')
                setNotification(`Successfully registered as ${user.name} `, 'success')
            } else  throw new Error(response.message)
        }   catch (exception) {
                setNotification(exception.message, 'error')
        }
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between py-4">
        <Card color="transparent" shadow={false} className="w-80 max-w-screen-lg sm:w-96 p-8">
        <Typography variant="h4" color="blue-gray" className="mb-4">
            Register
        </Typography>
        <form className="mb-4" onSubmit={handleRegister}>
            <div className="mb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Name
            </Typography>
            <Input
                size="lg"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={handleNameChange}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                className: "before:content-none after:content-none",
                }}
            />
            </div>
            <div className="mb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Email
            </Typography>
            <Input
                size="lg"
                type="text"
                placeholder="name@mail.com"
                value={email}
                onChange={handleEmailChange}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                className: "before:content-none after:content-none",
                }}
            />
            </div>
            <div className="mb-6">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Password
            </Typography>
            <Input
                size="lg"
                type="password"
                placeholder="********"
                value={password}
                onChange={handlePasswordChange}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                className: "before:content-none after:content-none",
                }}
            />
            </div>
            <Button color="green" type="submit" fullWidth>
            Register
            </Button>
        </form>
        <Typography color="gray" className="text-center font-normal">
            Already have an account?{" "}
            <Link href="/auth/login">
            Sign In
            </Link>
        </Typography>
        </Card>
        </main>
    );
}

