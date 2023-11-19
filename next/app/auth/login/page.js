'use client'
import { useAuthContext } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import React from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useFormContext } from '@/app/contexts/FormContext'
import loginService from '@/app/services/login'
import Link from 'next/link';
import { useNotification } from '@/app/contexts/NotificationContext';

export default function LoginPage() {
    const { user, setUser, setToken } = useAuthContext()
    const router = useRouter()
    const { setNotification } = useNotification()

    if (user !== null) {
        router.push('/')
    }

    const { email, setEmail, password, setPassword } = useFormContext()
  
    const handleUsernameChange = (event) => {
      setEmail(event.target.value)
    }
  
    const handlePasswordChange = (event) => {
      setPassword(event.target.value)
    }
  
    const handleLogin = async (event) => {
      event.preventDefault()
      try {
        const response = await loginService.login({
          email, password,
        })
          if ((typeof response.user !== 'undefined') && (response.user !== null)) {
          const { user } = response
          const fetchedToken = response.tokens.access.token
          if (window !== undefined) {
              window.localStorage.setItem('loggedStudyBuddyUser', JSON.stringify(user),)
              window.localStorage.setItem('loggedStudyBuddyUserToken', JSON.stringify(fetchedToken))
          }
          // blogService.setToken(fetchedToken)
          setUser(user)
          setToken(fetchedToken)
          setEmail('')
          setPassword('')
          router.push('/')
          setNotification(`Successfully logged in as ${user.name} `, 'success')
        } else throw new Error(response.message)
      }
      catch (exception) {
        setNotification(exception.message, 'error')
      }
      console.log('logging in with', email, password)
    }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-4">
     <div>
     <Card color="transparent" shadow={false} className="w-80 max-w-screen-lg sm:w-96 p-8">
    <Typography variant="h4" color="blue-gray" className="mb-4">
      Login
    </Typography>
    <form className="mb-4" onSubmit={handleLogin}>
      <div className="mb-4">
        <Typography variant="h6" color="blue-gray" className="mb-2">
          Email
        </Typography>
        <Input
          size="lg"
          type="text"
          placeholder="name@mail.com"
          value={email}
          onChange={handleUsernameChange}
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
        Login
      </Button>
    </form>
    <Typography color="gray" className="text-center font-normal">
      {`Dont have an account?${" "}`}
      <Link href='/auth/register'>
        Sign Up
      </Link>
    </Typography>
  </Card>
    </div>
    </main>
  )
}
