import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Button } from "@material-tailwind/react";
import classController from '@/app/controllers/class';
import userController from '@/app/controllers/user';
import { useNotification } from '@/app/contexts/NotificationContext';

export default function ComboBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { user, setUser, token, setToken } = useAuthContext();
  const [selectedClass, setSelectedClass] = useState(null);
  const { setNotification } = useNotification();

  useEffect(() => {
    async function fetchData() {
      const response = await classController.get(query)
      setResults(response);
    }
    fetchData();
  } , [query]);

  const handleQueryChange = (event, value) => {
    console.log(value, 'value')
    setQuery(event.target.value);
    console.log(event.target.value);
  }


  const handleAddClass = async () => {
    const updatedUser = await userController.addClass(user, token, selectedClass)
    if (updatedUser.ok) {
      console.log(updatedUser, 'updatedUser')
      setUser(updatedUser.body)
      setNotification(updatedUser.message, 'success')
    } else {
      setNotification(updatedUser.message, 'error')
    }
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