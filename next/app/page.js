"use client"
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import RegisterService from './services/register'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import './index.css'

import { useContext } from 'react'

import {useAuth} from './contexts/AuthContext'
import { useRender } from './contexts/RenderContext'

import { Button } from "@material-tailwind/react";

import Hero from './components/Hero'

export default function Home() {
  const [blogs, setBlogs] = useState([])
  
  const { user, setUser } = useAuth()
  const { render, setRender } = useRender()
  console.log(render)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  const createBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        // show success UI message
        setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setMessageType('success')
        setTimeout(() => {
          setMessage(null)
        }, 10000)
      })
  }
  const handleLikeClick = (blog) => {
    console.log('clicked')
    const blogObject = {
      user: blog.user.id,
      likes: blog.likes+1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    blogService
      .update(blog.id, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.map(b => b.id !== returnedBlog.id ? b : returnedBlog))
      })
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedStudyBuddyUser')
    setRender('default')
  }

  const handleUsernameChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  // useEffect(() => {
  //   const loggedUserJSON = window.localStorage.getItem('loggedStudyBuddyUser')
  //   if (loggedUserJSON) {
  //     const user = JSON.parse(loggedUserJSON)
  //     setUser(user)
  //     blogService.setToken(user.token)
  //   }
  // }, [])

  // useEffect(() => {
  //   blogService
  //     .getAll()
  //     .then(blogs =>
  //       setBlogs(blogs)
  //     )
  // }, [])

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

  const handleRegister = async (event) => {
    event.preventDefault()
    try {
      const response = await RegisterService.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      })
      console.log(response)
      const { user, tokens } = response
      window.localStorage.setItem('loggedStudyBuddyUser', JSON.stringify(user),)
      blogService.setToken(tokens.access.token)
      setUser(user)
      setEmail('')
      setPassword('')
      setRegisterEmail('')
      setRegisterPassword('')
      setRegisterName('')
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <div>
      <Notification message = {message} type={messageType} />
      { render === 'default' && <Hero/> }
      { (render ==='login' && user === null) &&
        <LoginForm
          email={email}
          password={password}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          handleLogin={handleLogin}
        />
      }
      { (render === 'register' && user === null) &&
      
        <RegisterForm
          name={registerName}
          email={registerEmail}
          password={registerPassword}
          setName={setRegisterName}
          setEmail={setRegisterEmail}
          setPassword={setRegisterPassword}
          handleRegister={handleRegister}
        />
      }
      {user && <div>
        {user.name && <p>{user.name} logged in</p> }
        <form onSubmit={handleLogout}>
          <Button
           color="red"
            id='logout-button'
            type='submit'
          >
            Log out
          </Button>
        </form>
        {/* {user.classes && user.classes.map(c => <p key={c.id}>{c.class_title}</p>)} */}

        {/* <Togglable buttonLabel="new blog" >
          <BlogForm
            createBlog={createBlog}
          />
        </Togglable> */}
      </div>
      }
      {/* {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          setMessage={setMessage}
          setMessageType={setMessageType}
          user={user}
          handleLikeClick={() => handleLikeClick(blog)}
        />
      )} */}
    </div>
    </main>
  )
}
