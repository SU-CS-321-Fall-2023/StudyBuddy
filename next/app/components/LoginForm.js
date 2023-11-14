"use client"
import React from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useRender } from '../contexts/RenderContext'
import { useFormContext } from '../contexts/FormContext'
import { useNotificationContext } from '../contexts/NotificationContext';
import { useAuthContext } from '../contexts/AuthContext';
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = () => {

  const { email, setEmail, password, setPassword } = useFormContext()
  const { render, setRender } = useRender()
  const { message, setMessage, messageType, setMessageType } = useNotificationContext();
  const { user, setUser } = useAuthContext()

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
      window.localStorage.setItem('loggedStudyBuddyUser', JSON.stringify(user),)
      blogService.setToken(tokens.access.token)
      setUser(user)
      setEmail('')
      setPassword('')
      setMessage('Successfully logged in')
      setMessageType('success')
      setRender('logged-in')
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
);
        }

export default LoginForm;
