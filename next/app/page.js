"use client"
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import './index.css'

export default function Home() {
  const [blogs, setBlogs] = useState([])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
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
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleUsernameChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs(blogs)
      )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await loginService.login({
        email, password,
      })
      const { user, tokens } = response
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user),)
      blogService.setToken(tokens.access.token)
      setUser(user)
      setEmail('')
      setPassword('')
      setMessage('Successfully logged in')
      setMessageType('success')
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
      <Notification message = {message} type={messageType} />
      <h2>blogs</h2>
      {user === null &&
      <Togglable buttonLabel="Login">
        <LoginForm
          email={email}
          password={password}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          handleLogin={handleLogin}
        />
      </Togglable>}
      {user && <div>
        {user.name && <p>{user.name} logged in</p> }
        <form onSubmit={handleLogout}>
          <button
            id='logout-button'
            type='submit'
          >
            Log out
          </button>
        </form>

        <Togglable buttonLabel="new blog" >
          <BlogForm
            createBlog={createBlog}
          />
        </Togglable>
      </div>
      }
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          setMessage={setMessage}
          setMessageType={setMessageType}
          user={user}
          handleLikeClick={() => handleLikeClick(blog)}
        />
      )}
    </div>
    </main>
  )
}
