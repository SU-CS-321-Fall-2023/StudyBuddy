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
    Typography,
} from "@material-tailwind/react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { studyGroupController } from '@/app/controllers';
import Link from 'next/link';

export default function Page() {
    const { name, setName } = useFormContext()
    const { user, setUser } = useAuthContext()
    const [studygroups, setStudygroups] = useState([]);
    const { setNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [studygroup, setStudyGroup] = useState({})

    const [isModalOpen, setModalOpen] = useState(false);
    const [newStudyGroupName, setNewStudyGroupName] = useState('');

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

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
                setStudygroups(studygroups => [...studygroups, response])
                setNotification(`Successfully created the group. `, 'success')
            } else throw new Error(response.message)
        } catch (exception) {
            setNotification(exception.message, 'error')
        }
    }

    const handleJoinStudyGroup = async (event, studygroup) => {
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

    const handleSearchStudyGroup = async (event) => {
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
            {/* <div>
                <form className="flex items-center" onSubmit={handleSearchStudyGroup}>
                    <label for="simple-search" className="sr-only">Search</label>
                    <div className="relative w-full">
                        <Input onChange={handleSearchTermChange} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search group..." required />
                    </div>
                    <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </form>
            </div>
            <div className="w-full lg:w-8/12 px-4 mx-auto">
                <div className="flex flex-wrap justify-center pb-3"></div>
                {isLoading && <Spinner />}
            </div>
            <div className="flex flex-col flex-wrap justify-center ">
                {searchTerm ? (searchResults?.map((sgs) => (
                    <>
                        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">{sgs.name}</span>
                                <form onSubmit={(event) => handleJoinStudyGroup(event, sgs)}>
                                  <button type='submit' href="#" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Join</button>
                                </form>
                            </div>
                        </div>
                    </>
                ))) : ((studygroups?.map((sgs) => (
                    <>
                        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">{sgs.name}</span>
                            </div>
                        </div>
                    </>
                ))))}
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
            </div> */}

            <div className='flex flex-col justify-center items-center'>

                <div className='flex flex-row justify-center align-center items-center'>
                <TextField
        onChange={handleSearchTermChange}
        className='rounded-full p-2 px-4 mt-12'
        variant='outlined'
        fullWidth
        placeholder='Search for study groups'
      />
      
    </div>
    <Button
        className='bg-blue-500 hover:bg-blue-700 text-white mb-7'
        onClick={handleSearchStudyGroup}
        variant='contained'
      >
                Search
      </Button>

                {isModalOpen && (
                    <div className='modal z-10'>
                        <div className='bg-white modal-content border border-gray-300 rounded-lg p-4'>
                            <div className='flex justify-end'>
                                <span className='close bg-gray-400 h-5 w-5 rounded-full flex justify-center items-center' onClick={closeModal}>
                                    &times;
                                </span>
                            </div>
                            <h2>Create Study Group</h2>
                            <input
                                type="text"
                                placeholder="Enter study group name"
                                //value={newStudyGroupName}
                                onChange={handleStudyGroupNameChange}
                                className='border border-gray-300 rounded-lg p-2 w-full mt-4'
                            />
                            <div className=' flex gap-4'>
                                <button className='bg-blue-500 hover:bg-blue-700 text-white px-4 rounded-full mt-4' onClick={handleCreateStudyGroup}>Create</button>
                                <button className='bg-red-500 hover:bg-blue-700 text-white px-4 rounded-full mt-4' onClick={closeModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                    <div className='flex justify-center items-center'>
                    <h2 className='text-2xl font-bold'>Study Groups</h2>
                    </div>

                {searchTerm ? (<div className='flex flex-col gap-2'>
                    {searchResults?.map((studyGroup) => (
                        <div
                            className='flex justify-between space-x-3 items-center bg-gray-100 rounded-lg shadow-lg p-4 m-4'
                            key={studyGroup.id}
                        >
                            <h2 className='text-2xl font-bold'>{studyGroup.name}</h2>
                            <button onClick={(event) => handleJoinStudyGroup(event, studyGroup)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4'>
                                Join
                            </button>
                        </div>
                    ))}
                </div>) : (<div className='flex flex-col gap-2'>
                    {studygroups?.map((studyGroup) => (
                        <Link key={studyGroup.id} href={`/studygroups/${studyGroup._id}`}>
                            <div
                                className='flex justify-between space-x-3 items-center bg-gray-100 rounded-lg shadow-lg p-4 m-4'
                                key={studyGroup.id}
                            >
                                <h2 className='text-2xl font-bold'>{studyGroup.name}</h2>
                            </div>
                        </Link>
                    ))}
                </div>)}
            </div>
        </main>
    )
}