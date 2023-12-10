'use client'
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from 'next/navigation'
import io from "socket.io-client"

const socket = io("http://localhost:3000")
import { groupMessagesController } from '@/app/controllers';
import { useAuthContext } from "@/app/contexts/AuthContext"

export default function Page(props) {
    const searchParams = useSearchParams()
    const [studygroup, setStudyGroup] = useState({})
    const [messages, setMessages] = useState([])
    const [content, setContent] = useState('')
    const { user, setUser } = useAuthContext()
    const messageRef = useRef()
    const groupId = props.params.id

    useEffect(() => {
        socket.emit("ChatMessages", {
            groupId
        })
    }, [])

    useEffect(() => {
        socket.emit('joinGroup', {
            groupId
        })
        socket.on('newMessage', ({ message }) => {
            setMessages(message)
            console.log('m', message)
        })
        messageRef.current.value = ''

        return () => {
            socket.emit('leaveGroup', { groupId })
        }
    }, [messages])

    const handleSendMessage = () => {
        setContent('')
        if (socket) {
            socket.emit("groupChatMessage", {
                groupId,
                message: {
                    user: user.id,
                    content: messageRef.current.value,
                    timestamp: Date.now()
                }
            })
            messageRef.current.value = ''
            console.log({ user, messageRef })
        }
    }

    const showChats = (message) => {
        console.log(message)
        if (message.user.id == user.id) {
            return (
                <div className="flex items-center self-end rounded-xl rounded-tr bg-blue-500 py-2 px-3 text-white">
                    <p>{message.content}</p>
                </div>
            )
        } else {
            return (
                <div className="flex flex-col self-start rounded-xl rounded-tl bg-gray-300 py-2 px-3">
                    <div className="flex items-center self-start rounded-xl rounded-tl bg-gray-300 py-2 px-3">
                        <p>{message.content}</p>
                    </div>
                    <span class="text-sm font-normal text-gray-500 dark:text-gray-500">{message.user.name}</span>
                </div>
            )
        }
    }


    return (
        <main className="flex min-h-200 flex-col items-center justify-between py-4">

            <div className="flex h-[350px] flex-col bg-white">
                <div className="bg-white">
                    <h1 className="text-center text-2xl font-bold text-white"></h1>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <div className="flex flex-col space-y-2 p-4">
                        {messages.length > 0 ? messages.map((message) => (
                            showChats(message)
                        )) : <div><p>No group messages</p></div>}

                    </div>
                </div>
                <div className="flex items-center p-4">
                    <input ref={messageRef} type="text" placeholder="Type your message..." className="w-full rounded-lg border border-gray-300 px-4 py-2" />
                    <button type="submit" onClick={handleSendMessage} className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white">Send</button>
                </div>
            </div>
        </main>
    )
}