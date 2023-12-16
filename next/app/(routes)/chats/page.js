'use client'
import { useFormContext } from '@/app/contexts/FormContext'
import { useNotification } from '@/app/contexts/NotificationContext';
import { useAuthContext } from "@/app/contexts/AuthContext";
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Spinner } from "@material-tailwind/react";
import {
    CardBody,
    Input,
} from "@material-tailwind/react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { chatController } from '@/app/controllers';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function Page() {
    const { name, setName } = useFormContext()
    const { user, setUser, token, fetchedUser, setFetchedUser } = useAuthContext()
    const [chats, setChats] = useState([]);
    const { setNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);

    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true)

        const fetchChats = async () => {
            const response = await chatController.getAllChats(user);
            console.log(response, 'fetchedchats')
            setChats(response)
        }


        fetchChats()
            .then((response) => {
                console.log(response, 'response')
            })
            .catch(console.error);
        setIsLoading(false)
    }, [])

    const friends = (friends) => {
        if (friends.includes(user.id)) {
            return (<d class="mb-2  text-2xl rounded-full font-bold tracking-tight text-white-900 dark:text-white">friends</d>)
        } else {
            return (<d class="mb-2 text-2xl rounded-full font-bold tracking-tight text-white-900 dark:text-white">Not friends</d>)
        }
    }

    const ContactCard = (chat) => {
        if (chat.receiverId.id == user.id) {
            return (

                <div class="flex flex-row max-w-sm p-4 bg-green-500 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <p class="mb-2 text-2xl font-bold tracking-tight text-white-900 dark:text-white">{chat.senderId.name} -</p>
                    {friends(chat.senderId.friends)}
                </div>
            )
        } else {
            return (
                <div class="flex flex-row max-w-sm p-4 bg-green-500 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <p class="mb-2 text-2xl font-bold tracking-tight text-white-900 dark:text-white">{chat.receiverId.name} -</p>
                    {friends(chat.receiverId.friends)}
                </div>
            )
        }

    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between py-4">

            <div className='flex flex-col justify-center items-center'>
                {chats.length > 0 ? (chats.map((chat) => (
                    <Link key={chat._id} href={`/chats/${chat._id}`}>
                        {ContactCard(chat)}
                    </Link>
                ))) : <div>No chats</div>}
            </div>
        </main>
    )
}