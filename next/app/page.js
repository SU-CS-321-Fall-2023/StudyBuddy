"use client"

import blogService from './services/blogs'

import './index.css'
import { useAuthContext } from './contexts/AuthContext'

import { useRender } from './contexts/RenderContext'

import { useNotificationContext } from './contexts/NotificationContext'
import { useContentContext } from './contexts/ContentContext'
import { useFormContext } from './contexts/FormContext'

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
    if (window !== undefined) {
      window.localStorage.removeItem('loggedStudyBuddyUser')
    }
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
      <Hero/> 
    </div>
    </main>
  )
}
