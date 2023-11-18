import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Button } from "@material-tailwind/react";
import { useNotificationContext } from '../contexts/NotificationContext';

export default function ComboBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { user, setUser, token, setToken } = useAuthContext();
  const [selectedClass, setSelectedClass] = useState(null);

  const { setMessage, setMessageType } = useNotificationContext();

  useEffect(() => {
    async function fetchData() {
      const baseUrl = 'http://localhost:3000/v1/classes'
      const url = query ? `${baseUrl}?search=${query}` : baseUrl
      const data = await fetch(url).then((res) => res.json());
      setResults(data.results);
    }
    fetchData();
  } , [query]);
  const handleQueryChange = (event, value) => {
    console.log(value, 'value')
    setQuery(event.target.value);
    console.log(event.target.value);
  }

  const addClass = async () => {
    console.log(selectedClass, 'selectedClass')
    const baseUrl = `http://localhost:3000/v1/users/${user.id}`
    // make a fetch with patch request and bearer token
    // descture user.classes into an array of strings with each class id
        // do it
    const transformedClasses = user.classes.map((classObj) => classObj.id);
    if (selectedClass) {
      // handle case where user already has class
      if (transformedClasses.includes(selectedClass.id)) {
        console.log('user already has class')
        setMessage('You already have this class!')
        setMessageType('error')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        return
      }
      try {
      const response = await fetch(baseUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.replace(/"/g, '')}`,
        },
        
        body: JSON.stringify({
          classes: [...transformedClasses, selectedClass.id],
        }),
      })

      const data = await response.json();
      console.log(data, 'data')

      if (response.ok) {
        setUser(data)
        setSelectedClass(null)
        setMessage(`Successfully added ${selectedClass.department_code} ${selectedClass.class_code} to your classes`)
        setMessageType('success')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  }

  const handleAddClass = () => {
      addClass();
  }

  return (
    <>
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={results}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField
      onChange={handleQueryChange}
        {...params} label="Class" />}

      onChange={(event, value) => {
        setSelectedClass(value);
        console.log(value, 'value')
        
      }}
      getOptionLabel={(option) => option.department_code + " " + option.class_code + ": " + option.class_title}
    />

    <Button
      color="green"
      buttonType="filled"
      size="regular"
      rounded={false}
      block={false}
      iconOnly={false}
      ripple="light"
      className='mt-4'
      onClick={handleAddClass}
    >
      Add Class
    </Button>
    </>
  );
}