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

import RegisterService from '../services/register'
import blogService from '../services/blogs'

const RegisterForm = () => {
    const { render, setRender } = useRender()

    const { email, setEmail, password, setPassword, name, setName } = useFormContext()
    const { message, setMessage, messageType, setMessageType } = useNotificationContext();
    const { user, setUser } = useAuthContext()
    
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
      const response = await RegisterService.register({
        name,
        email,
        password
      })
      console.log(response)
      const { user, tokens } = response
      window.localStorage.setItem('loggedStudyBuddyUser', JSON.stringify(user),)
      blogService.setToken(tokens.access.token)
      setUser(user)
      setEmail('')
      setPassword('')
      setName('')
      setMessage(`Successfully registered as ${user.name} and logged in`)
      setMessageType('success')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    catch (exception) {
      console.log(exception)
      setMessage(exception.response.data.message)
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
        <a onClick={() => setRender('login')} className="font-medium text-gray-900">
          Sign In
        </a>
      </Typography>
    </Card>
  );
}

export default RegisterForm;
