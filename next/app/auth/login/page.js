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
import { useNotificationContext } from '@/app/contexts/NotificationContext';
import loginService from '@/app/services/login'
import blogService from '@/app/services/blogs'

export default function LoginPage() {
    const { user, setUser } = useAuthContext()
    const router = useRouter()

    if (user !== null) {
        router.push('/')
    }

    const { email, setEmail, password, setPassword } = useFormContext()
    const { message, setMessage, messageType, setMessageType } = useNotificationContext();
  
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
        const { user, tokens } = response
        localStorage.setItem('loggedStudyBuddyUser', JSON.stringify(user),)
        blogService.setToken(tokens.access.token)
        setUser(user)
        setEmail('')
        setPassword('')
        setMessage('Successfully logged in')
        setMessageType('success')
        router.push('/')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
      catch (exception) {
        setMessage('wrong email or password')
        setMessageType('error')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
      console.log('logging in with', email, password)
    }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
      <a onClick={() => setRender('register')} className="font-medium text-gray-900">
        Sign Up
      </a>
    </Typography>
  </Card>
    </div>
    </main>
  )
}
