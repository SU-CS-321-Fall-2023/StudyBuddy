'use client'
import { Button } from "@material-tailwind/react";
import { useAuthContext } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";
import { userController } from '@/app/controllers';

import { Spinner } from "@material-tailwind/react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useRouter } from 'next/navigation'

export default function Page() {
    const { user, setUser } = useAuthContext()
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    if (user === null || !user) {
        router.push('/auth/login');
      }
    
    const { setNotification } = useNotification();

    const handleMatch = async () => {
        setIsLoading(true);
        const response = await userController.getAll();

        console.log('User:', user);
        const userClassIds = user.classes.map(userClass => userClass.id); 
        console.log('User Class IDs:', userClassIds);
        console.log(response, 'results')
      
        const matchedResults = response.results?.filter(otherUser => {

            if (otherUser.id === user.id) {
                return false;
                }
          const matches = otherUser.classes.filter(cls => 
            userClassIds.includes(cls.id)
          ) || []
      
          return matches.length > 0;
      
        });
      
        console.log('Matched Results:', matchedResults);
      
        setResults(matchedResults || []);
        setIsLoading(false);
      };

      const handleCancelFriendRequest = async (recipientUser) => {
        const response = await userController.cancelFriendRequest(user, recipientUser)
        console.log(response, 'cancelFriendRequest');
        if (response.ok) {
            setNotification(`Successfully cancelled a friend request to ${recipientUser.name}`, 'success')
            handleMatch()
        } else {
        setNotification(`Error cancelling a buddy request to ${recipientUser.name}`, 'error')
        }
    }

    const handleRemoveBuddy = async (removeeUser) => {
        const response = await userController.removeFriend(user, removeeUser)

        if (response.ok) {
            setNotification(`Successfully removed ${removeeUser.name} as a buddy`, 'success')
            handleMatch()
        } else {
        setNotification(`Error removing ${removeeUser.name} as a buddy`, 'error')
        }
    }
      const handleAddBuddy = async (recipientUser) => {
        const response = await userController.sendFriendRequest(user, recipientUser.id)
        console.log(response);
        if (response.ok) {
            setNotification(`Successfully sent a friend request to ${recipientUser.name}`, 'success')
            handleMatch()
        } else {
        setNotification(`Error sending a buddy request to ${recipientUser.name}`, 'error')
      }
      }

    return (
        <section className="pt-16 bg-blueGray-50">
        <div className="w-full lg:w-8/12 px-4 mx-auto">   
        <div className="flex flex-wrap justify-center pb-3">
        {isLoading && <Spinner /> }
        {!isLoading && <Button onClick={handleMatch} color='blue' >Match</Button>}
        </div>
            <div class="grid grid-cols-4 gap-4">
                {results?.map((result) => (
                <a key={result.id} class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{result.name}</h5>
                {result.classes.map((cls) => (
                    <p key={cls.id} class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">{cls.department_code} {cls.class_code}</p>
                ))}
                { result.friends?.includes(user.id) ? (
                <>
                <p>You are already buddies</p>
                <Button color='red' onClick={()=> handleRemoveBuddy(result)} >Remove Buddy</Button>
                </>
                ) : result.friendRequests?.includes(user.id) ? (
                <>
                <p>Sent Friend Request</p>
                <Button color='red' onClick={()=> handleCancelFriendRequest(result)} >Cancel Request</Button>
                </>
                ) : (
                <Button color='blue' onClick={()=> handleAddBuddy(result)} >Add Buddy</Button>
                )}
                </a> 
                ))}
            </div>
            </div>
        </section>
    )
    }