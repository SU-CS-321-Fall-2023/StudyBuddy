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

        socket.emit('joinGroup', {
            groupId
        })

        socket.on('newMessage', ({ message, groupId }) => {
            setMessages([...messages, ...message])
            console.log('m', message)
        })
        // const fetchGroup = async () => {
        //     setStudyGroup({})
        //     const response = await groupMessagesController
        //         .getGroupMessages(props.params.id);
        //         console.log(response)
        //     setStudyGroup(response || [])
        // }

        // fetchGroup().then((error) => console.log(error))
        return () => {
            socket.emit('leaveGroup', { groupId })
        }
    }, [])

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
            console.log({ user, messageRef })
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between py-4">

        <div className="flex h-screen flex-col bg-white">
            <div className="bg-white">
                <h1 className="text-center text-2xl font-bold text-white"></h1>
            </div>
            <div className="flex-grow overflow-y-auto">
                <div className="flex flex-col space-y-2 p-4">
                    {messages.map((message) => (
                        <>
                            <div className="flex items-center self-end rounded-xl rounded-tr bg-blue-500 py-2 px-3 text-white">
                                <p>{message.content}</p>
                            </div>
                            <div className="flex items-center self-start rounded-xl rounded-tl bg-gray-300 py-2 px-3">
                                <p>This is the sender</p>
                            </div>
                        </>
                    ))}
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