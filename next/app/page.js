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

import { useAuthContext } from './contexts/AuthContext'

import { useRender } from './contexts/RenderContext'

import { useNotificationContext } from './contexts/NotificationContext'
import { useContentContext } from './contexts/ContentContext'
import { useFormContext } from './contexts/FormContext'

import { Button } from "@material-tailwind/react";

import Hero from './components/Hero'
import { useRouter } from 'next/navigation'

// TODO: extract notification the layout in its own div
// TODO: extract logout button into navbar to be shown when logged in

export default function Home() {
  
  const { user, setUser } = useAuthContext()
  const { render, setRender } = useRender()
  console.log(render)
  const { blogs, setBlogs } = useContentContext()
  const { email, setEmail, password, setPassword, registerName, setRegisterName, registerEmail, setRegisterEmail, registerPassword, setRegisterPassword } = useFormContext()
  const { message, setMessage, messageType, setMessageType } = useNotificationContext();
  const router = useRouter()

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

  if (user == null) {
    router.push('/auth/login')
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <div>
      <Hero/> 
    </div>
    </main>
  )
}
