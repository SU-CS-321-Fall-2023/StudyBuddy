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

// TODO: extract notification the layout in its own div
// TODO: extract logout button into navbar to be shown when logged in

export default function Home() {
  
  const { user, setUser } = useAuthContext()
  const { render, setRender } = useRender()
  console.log(render)
  const { blogs, setBlogs } = useContentContext()
  const { email, setEmail, password, setPassword, registerName, setRegisterName, registerEmail, setRegisterEmail, registerPassword, setRegisterPassword } = useFormContext()
  const { message, setMessage, messageType, setMessageType } = useNotificationContext();

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
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <div>
      <Notification message = {message} type={messageType} />
      { render === 'default' && <Hero/> }
      { (render ==='login' && user === null) &&
        <LoginForm />
      }
      { (render === 'register' && user === null) &&
      
        <RegisterForm />
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
