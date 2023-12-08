'use client'
import { useFormContext } from '@/app/contexts/FormContext'
import { useNotification } from '@/app/contexts/NotificationContext';
import { useAuthContext } from "@/app/contexts/AuthContext";
import { useEffect, useState } from 'react'
import { Spinner } from "@material-tailwind/react";
import {
    Card,
    CardBody,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";

import { studyGroupController } from '@/app/controllers';

export default function Page() {
    const { name, setName } = useFormContext()
    const { user, setUser } = useAuthContext()
    const [studygroups, setStudygroups] = useState([]);
    const { setNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [studygroup, setStudyGroup] = useState({})

    useEffect(() => {
        setIsLoading(true)

        const fetchstudygroups = async () => {
            const response = await studyGroupController.getAllStudyGroups(user);
            setStudygroups(response || [])
        }

        fetchstudygroups()
            .catch(console.error);
        setIsLoading(false)
        console.log(studygroups)
    }, [])

    const handleStudyGroupNameChange = (event) => {
        setName(event.target.value)
    }

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value)
    }

    const handleCreateStudyGroup = async (event) => {
        event.preventDefault()
        try {
            const response = await studyGroupController.createStudyGroup(name)
            if ((typeof response !== 'undefined') && (response !== null)) {
                console.log('studygroup', response)
                setUser([...studygroups, response])
                setNotification(`Successfully created the group. `, 'success')
            } else throw new Error(response.message)
        } catch (exception) {
            setNotification(exception.message, 'error')
        }
    }

    const handleJoinStudyGroup = async(event, studygroup) => {
        event.preventDefault()
        const response = await studyGroupController.joinStudyGroup(studygroup, user);
        console.log('st', studygroup, 'user', user)
        event.preventDefault()
        if (response.ok) {
            setStudygroups([...studygroups, response])
            setNotification(`Welcome to the group.`, 'success')
        } else {
        setNotification(`Error `, 'error')
        }
    }

    const handleSearchStudyGroup = async(event) => {
        setSearchResults([])
        event.preventDefault()
        const response = await studyGroupController.searchStudyGroup(searchTerm);
        if (response.ok) {
            setSearchResults(response.body)
            console.log(searchResults)
        } else throw new Error(response.message)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between py-4">
            <div>
                <form class="flex items-center" onSubmit={handleSearchStudyGroup}>
                    <label for="simple-search" class="sr-only">Search</label>
                    <div class="relative w-full">
                        <Input onChange={handleSearchTermChange} type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search group..." required />
                    </div>
                    <button type="submit" class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span class="sr-only">Search</span>
                    </button>
                </form>
            </div>
            <div className="w-full lg:w-8/12 px-4 mx-auto">
                <div className="flex flex-wrap justify-center pb-3"></div>
                {isLoading && <Spinner />}
            </div>
            <div className="flex flex-col flex-wrap justify-center ">
                {searchTerm && searchResults?.map((sgs) => (
                    <>
                        <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div class="flex items-center justify-between">
                                <span class="text-3xl font-bold text-gray-900 dark:text-white">{sgs.name}</span>
                                <form onSubmit={(event) => handleJoinStudyGroup(event, sgs)}>
                                  <button type='submit' href="#" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Join</button>
                                </form>
                            </div>
                        </div>
                    </>
                ))}
            </div>
            <div>
                <Card className="w-full max-w-[24rem]">
                    <CardBody>
                        <form className="mt-12 flex flex-col gap-4" onSubmit={handleCreateStudyGroup}>
                            <div>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-2 font-medium"
                                >
                                    Group name
                                </Typography>
                                <Input
                                    type="text"
                                    placeholder="Group name"
                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                    onChange={handleStudyGroupNameChange}
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                />
                            </div>
                            <Button size="lg" type='submit'>Create</Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </main>
    )
}