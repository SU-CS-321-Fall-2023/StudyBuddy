'use client'
import { Button } from "@material-tailwind/react";
import { useAuthContext } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";
import { userController, chatController } from '@/app/controllers';

import { Spinner } from "@material-tailwind/react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useRouter } from 'next/navigation'

export default function Page() {
  const { user, fetchedUser, setFetchedUser, setUser } = useAuthContext()
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  useEffect(() => {
    if (!user || user === null) {
      if (!user) {
        router.push('/auth/login');
      }
    }
  }, [user]);

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

  const handleAcceptFriendRequest = async (requesterUser) => {
    try {
      const response = await userController.acceptFriendRequest(user, requesterUser.id).then((res) => res.json());
      if (response.ok) {
        setNotification(`Successfully accepted a friend request from ${requesterUser.name}`, 'success')
        setUser(response.body)
      } else {
        setNotification(`Error accepting a buddy request from ${requesterUser.name}`, 'error')
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeclineFriendRequest = async (requesterUser) => {
    console.log(requesterUser, 'handleDeclineFriendRequest');
  }

  const handleRemoveBuddy = async (removeeUser) => {
    const response = await userController.removeFriend(user, removeeUser)

    if (response.ok) {
      setNotification(`Successfully removed ${removeeUser.name} as a buddy`, 'success')
      setUser(response.body)
      if (fetchedUser && fetchedUser.id === user.id) {
        setFetchedUser(response.body)
      }
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

  const handleChat = async (receiverUser) => {
    const response = await chatController.getSenderReceiverChat(user, receiverUser)
    if (response != null || response != undefined) {
      router.push(`/chats/${response._id}`);;
    } else {
      const response = await chatController.createChat(user.id, receiverUser.id)
      console.log(response);
      if (response.ok) {
        router.push(`/chats/${response._id}`);
      } else {
        setNotification(`Error creating a chat ${recipientUser.name}`, 'error')
      }
    }
  }

  return (
    <section className="pt-16 bg-blueGray-50">
      <div className="w-full lg:w-8/12 px-4 mx-auto">
        <div className="flex flex-wrap justify-center pb-3">
          {isLoading && <Spinner />}
          {!isLoading && <Button onClick={handleMatch} color='blue' >Match</Button>}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {results?.map((result) => (
            <a key={result.id} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{result.name}</h5>
              {result.classes.map((cls) => (
                <p key={cls.id} className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">{cls.department_code} {cls.class_code}</p>
              ))}
              {result.friends?.includes(user.id) ? (
                <>
                  <p>You are already buddies</p>
                  <Button color='red' onClick={() => handleRemoveBuddy(result)} >Remove Buddy</Button>
                  <Button color='yellow' onClick={() => handleChat(result)} >Chat</Button>
                </>
              ) : result.friendRequests?.includes(user.id) ? (
                <>
                  <p>Sent Friend Request</p>
                  <Button color='red' onClick={() => handleCancelFriendRequest(result)} >Cancel Request</Button>
                </>
              ) : user.friendRequests?.some(request => request.id === result.id) ? (
                <>
                  <p>Friend Request</p>
                  <Button color='green' onClick={() => handleAcceptFriendRequest(result)} >Accept Request</Button>
                  <Button color='red' onClick={() => handleDeclineFriendRequest(result)} >Decline Request</Button>
                </>
              )
                : (
                  <div>
                    <Button color='blue' onClick={() => handleAddBuddy(result)} >Add Buddy</Button>
                  </div>

                )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}