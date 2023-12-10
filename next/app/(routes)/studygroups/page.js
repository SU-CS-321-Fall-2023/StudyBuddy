'use client'
import { useFormContext } from '@/app/contexts/FormContext'
import { useNotification } from '@/app/contexts/NotificationContext';
import { useAuthContext } from "@/app/contexts/AuthContext";
import { useEffect, useState } from 'react'
import { Spinner } from "@material-tailwind/react";
import {
    CardBody,
    Input,
} from "@material-tailwind/react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { studyGroupController } from '@/app/controllers';
import Link from 'next/link';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

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

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    const StudyGroupCard = ({ studyGroupToShow }) => {
        return (
            <Card sx={{ backgroundColor: '#3498db', color: '#ffffff', marginBottom: 3,
            borderRadius: 3
            }}>
            <CardContent>
              <Typography variant="h5">
                {studyGroupToShow.name}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                href={`/studygroups/${studyGroupToShow._id}`}
                sx={{
                  backgroundColor: '#ffffff',
                  color: '#3498db',
                  '&:hover': {
                    backgroundColor: '#3498db',
                    color: '#ffffff',
                  },
                  borderRadius: 2
                }}
              >
                Go to Study Group
              </Button>
            </CardActions>
          </Card>
        )
    }

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
            setStudygroups([...studygroups, ...response])
        }

        fetchstudygroups()
            .catch(console.error);
        setIsLoading(false)
    }, [])

    const handleStudyGroupNameChange = (event) => {
        setNewStudyGroupName(event.target.value)
    }

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value)
    }

    const handleCreateStudyGroup = async (event) => {
        event.preventDefault()
        console.log(event, 'event')
        if (!newStudyGroupName || newStudyGroupName.trim() === '') {
            setNotification('Please enter a study group name', 'error')
            return
        }
        try {
        const response = await studyGroupController.createStudyGroup(newStudyGroupName, user)


        console.log(response, 'created study group, response') 
        setUser(response.user)
        setStudygroups([...studygroups, response.newGroup])
        setNotification(`Successfully created the group. `, 'success')
        setModalOpen(false)
        } catch (error) {
            setNotification(`Error `, error)
            console.log(error, 'error in create study group')
        }

    }
    const handleJoinStudyGroup = async (event, studygroup) => {
        event.preventDefault()
        setModalOpen(false)
        const response = await studyGroupController.joinStudyGroup(studygroup, user);
        if (response.ok) {
            setStudygroups([...studygroups, response])
            setNotification(`Welcome to the group.`, 'success')
        } else {
            setNotification(`Error `, 'error')
        }
    }

    const handleSearchStudyGroup = async (event) => {
        event.preventDefault()
        if (!searchTerm || searchTerm.trim() === '') {
            setNotification('Please enter a search term', 'error')
            return
        }
        const response = await studyGroupController.searchStudyGroup(searchTerm);
        if (response.ok) {
            setSearchResults(response.body)
        } else throw new Error(response.message)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between py-4">

            <div className='flex flex-col justify-center items-center'>

            <div className='flex justify-center items-center'>
                    <h2 className='text-2xl font-bold'>My Study Groups</h2>
            </div>
                    <div className='flex flex-col gap-2'>
                    {user?.studyGroups.length > 0 ? (user?.studyGroups.map((studyGroup) => (
                        <StudyGroupCard key={studyGroup.id} studyGroupToShow={studyGroup} />
                    ))) : (
                        <p>You haven't joined a study group yet.</p>
                    )
                }
                    </div>
                <div className='flex flex-row justify-center align-center items-center'>

                <TextField
                    value={searchTerm}
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
        sx={{ marginTop: 2, marginBottom: 2}}
      >
                Search
      </Button>

        <Button
        className='bg-green-500 hover:bg-green-700 text-white mb-7'
        onClick={toggleModal}
        variant='contained'
        sx={{
            backgroundColor: '#4CAF50', // Green color
            color: '#ffffff', // White text color
            '&:hover': {
            backgroundColor: '#45a049', // Darker green color on hover
            },
            marginBottom: 2,
        }}
        > 
           Create Study Group
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
                                value={newStudyGroupName}
                                onChange={handleStudyGroupNameChange}
                                className='border border-gray-300 rounded-lg p-2 w-full mt-4'
                            />
                            <div className=' flex gap-4'>
                                <Button className='bg-green-500 hover:bg-green-700 text-white px-4 mt-4' onClick={handleCreateStudyGroup}>Create</Button>
                                <Button className='bg-red-500 hover:bg-red-700 text-white px-4 mt-4' onClick={toggleModal}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                )}
                <div className='flex justify-center items-center'>
                    <h2 className='text-2xl font-bold'>Study Groups</h2>
                    </div>
                {searchTerm ? (
                <div className='flex flex-col gap-2'>
                    {searchResults.map((studyGroup) => (
                        <div className='flex justify-between space-x-3 items-center bg-gray-100 rounded-lg shadow-lg p-4 m-4' key={studyGroup.id}>
                            <h2 className='text-2xl font-bold'>{studyGroup.name}</h2>
                            <button onClick={(event) => handleJoinStudyGroup(event, studyGroup)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4'>
                                Join
                            </button>
                        </div>
                    ))}
                </div>) : (<div className='flex flex-col gap-2'>
                {studygroups?.map((studyGroup) => (
                <StudyGroupCard key={studyGroup.id} studyGroupToShow={studyGroup} />
                ))}
                </div>)}
            </div>
        </main>
    )
}