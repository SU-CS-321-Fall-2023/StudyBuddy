import React from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

import { useRender } from '../contexts/RenderContext'


const RegisterForm = ({
    handleRegister,
    name,
    email,
    password,
    setEmail,
    setPassword,
    setName,
    setRegisterName,
  }) => {
    const { render, setRender } = useRender()
    
  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
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
