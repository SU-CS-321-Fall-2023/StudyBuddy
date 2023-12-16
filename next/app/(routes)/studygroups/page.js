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
import { userController } from '@/app/controllers';

export default function Page() {
    const { name, setName } = useFormContext()
    const { user, setUser, token, fetchedUser, setFetchedUser } = useAuthContext()
    const [studygroups, setStudygroups] = useState([]);
    const { setNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [studygroup, setStudyGroup] = useState({})

    const [isModalOpen, setModalOpen] = useState(false);
    const [newStudyGroupName, setNewStudyGroupName] = useState('');

    useEffect(() => {
        if (user) {
        async function fetchUser() {
          const response = await userController.get(user.id, token)
          if (response.id === user.id) {
            setUser(response)
          }
          setIsLoading(false);
        }
        fetchUser();
        }
      }, [studygroups]);

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        setIsLoading(true)

        const fetchstudygroups = async () => {
            const response = await studyGroupController.getAllStudyGroups();
            console.log(response, 'fetchedstudygroups')   
            setStudygroups(response)
        }


        fetchstudygroups()
            .then((response) => {
                console.log(response, 'response')
            })
            .catch(console.error);
        setIsLoading(false)
    }, [])

    const handleStudyGroupNameChange = (event) => {
        setNewStudyGroupName(event.target.value)
    }

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value)
        // filter studygroups by search term without fetching from backend
        const filteredStudyGroups = studygroups.filter((studygroup) => {
            return studygroup.name.toLowerCase().includes(searchTerm.toLowerCase())
        })
        setSearchResults(filteredStudyGroups)
    }

    const handleCreateStudyGroup = async (event) => {
        setModalOpen(false)
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
        } catch (error) {
            setNotification(`Error `, error)
            console.log(error, 'error in create study group')
        }

    }
    const handleJoinStudyGroup = async (event, studygroup) => {
        event.preventDefault()
        setModalOpen(false)
        const response = await studyGroupController.joinStudyGroup(studygroup, user);
        console.log(response, 'join study group response')
        if (response.ok) {
            console.log(response.body, 'response body')
            console.log(response.body.body.updatedStudyGroups, 'updated study groups')
            console.log(response.body.body.updatedUser, 'updated user')
            setStudygroups(response.body.body.updatedStudyGroups)
            setNotification(`Welcome to the group.`, 'success')
        } else {
            setNotification(`Error `, response.message)
        }
    }

    const handleSearchStudyGroup = async (event) => {
        event.preventDefault()
        if (!searchTerm || searchTerm.trim() === '') {
            setNotification('Please enter a search term', 'error')
            return
        }
        // filter studygroups by search term without fetching from backend
        const filteredStudyGroups = studygroups.filter((studygroup) => {
            return studygroup.name.toLowerCase().includes(searchTerm.toLowerCase())
        })
        setSearchResults(filteredStudyGroups)
    }

    const StudyGroupCard = ({ studyGroupToShow }) => {
        if (!studyGroupToShow) {
          return null;
        }
        const isUserInStudyGroup = user.studyGroups.some((group) => group._id === studyGroupToShow._id)
        return (
          <Card
          sx={{ backgroundColor: '#3498db', color: '#ffffff', marginBottom: 3, borderRadius: 3,
          display: 'flex',  
          flexDirection: 'column',
        }}
          >
            <CardContent>
              <Typography variant="h5">
                {studyGroupToShow.name}
              </Typography>
              <Typography variant="body2">
                id: {studyGroupToShow._id}
                </Typography>
                <Typography variant="body2">
                members: {studyGroupToShow.users.length}
                </Typography>
                {isUserInStudyGroup ? (
                    <Typography variant="body2">
                        You are a member of this study group.
                        </Typography>):
                        (<Typography variant="body2">
                            You are not a member of this study group.
                            </Typography>)}
            </CardContent>
            <CardActions>
            {
            isUserInStudyGroup ? (
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
                    borderRadius: 2,
                    }}
                >
                    Go to Study Group
                </Button>
                </CardActions>
            ) : (
                <>
               
                <Button
                size="small"
                onClick={(event) => handleJoinStudyGroup(event, studyGroupToShow)}
                sx={{
                    color: '#ffffff',
                    '&:hover': {
                    backgroundColor: '#1769aa',
                    },
                    borderRadius: 2,
                }}
                >
                Join
                </Button>
                </>
            )
            }

            </CardActions>
          </Card>
        );
      };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between py-4">

            <div className='flex flex-col justify-center items-center'>
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
            marginTop: 2,
        }}
        > 
           Create Study Group
        </Button>

                {isModalOpen && (
                    <div className='modal z-10'>
                        <div className='bg-white modal-content border border-gray-300 rounded-lg p-4 mb-4'>
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
                
                    <h2 className='text-2xl font-bold'>My Study Groups</h2>
            </div>
                    <div className='flex flex-col gap-2'>
                    {user?.studyGroups.length > 0 ? (user?.studyGroups.map((studyGroup) => (
                        <StudyGroupCard key={studyGroup.id} studyGroupToShow={studyGroup} />
                    ))) : (
                        <p>You haven&apos;t joined a study group yet.</p>
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

  
                <div className='flex justify-center items-center'>
                    <h2 className='text-2xl font-bold'>All Study Groups</h2>
                    </div>
                    {
                    searchTerm ? (
                        <div className='flex flex-col gap-2'>
                        {searchResults.map((studyGroup) => (
                            <StudyGroupCard key={studyGroup.id} studyGroupToShow={studyGroup} />
                        ))}
                        </div>
                    ) : (
                        <div className='flex flex-col gap-2'>
                        {studygroups
                            ?.sort((groupA, groupB) => {
                            // Move groups where the user is a member to the front
                            const isUserInGroupA = user.studyGroups.some((group) => group._id === groupA._id);
                            const isUserInGroupB = user.studyGroups.some((group) => group._id === groupB._id);

                            if (isUserInGroupA && !isUserInGroupB) {
                                return -1;
                            } else if (!isUserInGroupA && isUserInGroupB) {
                                return 1;
                            } else {
                                return 0;
                            }
                            })
                            .map((studyGroup) => (
                            <StudyGroupCard key={studyGroup.id} studyGroupToShow={studyGroup} />
                            ))}
                        </div>
                    )
                    }

            </div>
        </main>
    )
}