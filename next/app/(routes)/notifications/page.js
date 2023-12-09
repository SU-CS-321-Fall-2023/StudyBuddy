'use client'
import { useAuthContext } from '@/app/contexts/AuthContext';
import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    IconButton,
  } from "@material-tailwind/react";

import { userController } from '@/app/controllers';
import { useNotification } from '@/app/contexts/NotificationContext';

export default function Page() {
    const { user, fetchedUser, setFetchedUser, setUser, token } = useAuthContext()
    const { setNotification } = useNotification();

    const handleAccept = async (requesterUser) => {
        const response = await userController.acceptFriendRequest(user, requesterUser.id).then((res) => res.json());
        console.log(response, 'handleaccept');
        if (response.ok) {
            setNotification(`Successfully accepted a friend request from ${requesterUser.name}`, 'success')
            setUser(response.body)
            if (fetchedUser.id === user.id) {
                setFetchedUser(response.body)
            }
        } else {
        setNotification(`Error accepting a buddy request from ${requesterUser.name}`, 'error')
      }
      }

    return (
        <section className="pt-16 bg-blueGray-50">
        <div className="w-full lg:w-4/12 px-4 mx-auto">
        <div>
            <Typography variant='h4'> Buddy Requests </Typography>
            {user?.friendRequests?.map((request) => {
                return (
                    <div key={request.id}>
                        <Typography> {request.name} </Typography>
                        <div className='grid-cols-2'>
                        <Button color='green' onClick={() => handleAccept(request)}> Accept </Button>
                        <Button onClick={() => {}}> Reject </Button>
                        </div>
                    </div>
                )})
            }
        </div>
        </div>
        </section>
    )
}