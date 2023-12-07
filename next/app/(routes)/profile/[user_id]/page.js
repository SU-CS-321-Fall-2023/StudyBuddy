"use client"
import { useAuthContext } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";
import Image from 'next/image'
import Loading from "@/app/components/Loading";
import ClassSearch from "@/app/components/ClassSearch";
import { Button } from "@material-tailwind/react";

import { useNotificationContext } from "@/app/contexts/NotificationContext";
import { userController } from "@/app/controllers";
import { useNotification } from '@/app/contexts/NotificationContext';
import { useRouter } from 'next/navigation'

export default function Page( {params}) {
  // TODO: Extract fetches into their own services
  const { user, fetchedUser, setFetchedUser, setUser, token } = useAuthContext()
  const { setMessage, setMessageType } = useNotificationContext();
  const { setNotification } = useNotification();
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);

  if (user && user.id !== params.user_id) {
    router.push(`/profile/${user.id}`)
  }

  // use useEffect to fetch instead of async function
  useEffect(() => {
    if (!fetchedUser) {
      setIsLoading(true);
    }
    async function fetchUser() {
      const response = await userController.get(params.user_id, token)
      setFetchedUser(response);
      if (response.id === user.id) {
        setUser(response)
      }
      setIsLoading(false);
    }
    fetchUser();
  }, [params.user_id, token]);

  // TODO: after extracting this function, make sure it can edit any received property
  // instead of explicitly editing classes

  const handleDeleteButton = async (classToDelete) => {
    const updatedUser = await userController.removeClass(fetchedUser, token, classToDelete)
    if (updatedUser.ok) {
      setUser(updatedUser.body)
      setFetchedUser(updatedUser.body)
      setNotification(updatedUser.message, 'success')
    } else {
      setNotification(updatedUser.message, 'error')
    }
  }
  const handleRemoveBuddy = async (removeeUser) => {
    const response = await userController.removeFriend(fetchedUser, removeeUser)

    if (response.ok) {
        setNotification(`Successfully removed ${removeeUser.name} as a buddy`, 'success')
        setFetchedUser(response.body)
    } else {
    setNotification(`Error removing ${removeeUser.name} as a buddy`, 'error')
    }
}

  if (isLoading) {
    return <Loading />
  }

  return (
    <section className="pt-16 bg-blueGray-50">
  <div className="w-full lg:w-4/12 px-4 mx-auto">
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
      <div className="px-6">
        <div className="flex flex-wrap justify-center">
          <div className="w-full px-4 flex justify-center">
            <div className="relative">
              {/* <Image
                alt="..."
                width={150}
                height={150}
                src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
                className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
              /> */}
            </div>
          </div>
          <div className="w-full px-4 text-center mt-20">
            <div className="flex justify-center py-4 lg:pt-4 pt-8">
              {/* <div className="mr-4 p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  22
                </span>
                <span className="text-sm text-blueGray-400">Friends</span>
              </div>
              <div className="mr-4 p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  10
                </span>
                <span className="text-sm text-blueGray-400">Photos</span>
              </div>
              <div className="lg:mr-4 p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  89
                </span>
                <span className="text-sm text-blueGray-400">Comments</span>
              </div> */}
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
            {fetchedUser?.name}
          </h3>
          {/* <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
            <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400" />
            Los Angeles, California
          </div>
          <div className="mb-2 text-blueGray-600 mt-10">
            <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400" />
            Solution Manager - Creative Tim Officer
          </div>
          <div className="mb-2 text-blueGray-600">
            <i className="fas fa-university mr-2 text-lg text-blueGray-400" />
            University of Computer Science
          </div> */}
        </div>
        <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-9/12 px-4">
            <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
              {fetchedUser?.friends?.length 
              ? 
              <>
                <a className="text-md font-bold"> Buddies </a>
                <ul className="text-sm font-medium">
                {fetchedUser.friends.map(f =>
                <li key={f.id}>
                  {f.name}
                  {/* <Button color='red' onClick={()=> handleRemoveBuddy(f)}> x </Button> */}
                  </li>)}
                </ul>
              </>
              
              : 
              <p>{`You don't have any friends yet`}</p>
              }
              </p>
              <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
              {fetchedUser?.classes?.length 
              ? 
              <>
                <a className="text-md font-bold"> Classes </a>
                <ul className="text-sm font-medium">
                {fetchedUser.classes.map(c =>
                <li key={c.id}>
                  {c.department_code} {c.class_code}: {c.class_title}
                  <Button
                    color="red"
                    onClick={()=> handleDeleteButton(c)}>
                  x
                  </Button>
                  </li>)}
                </ul>
              </>
              
              : 
              <p>{`You don't have any classes yet`}</p>
              }
              </p>

              <ClassSearch />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}