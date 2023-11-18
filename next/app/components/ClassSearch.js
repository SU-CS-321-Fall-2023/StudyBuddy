import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

export default function ComboBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { user, setUser } = useAuthContext();
  const [selectedClass, setSelectedClass] = useState(null);

  //     const baseUrl = 'http://localhost:3000/v1/classes';
  //  const queryUrl = query ? `${baseUrl}?search=${query}` : baseUrl;

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

  return (
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
      getOptionLabel={(option) => option.department_code + " " + option.class_code + " - " + option.class_title}
      
        // renderOption={(props, option) => (
        //   <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
        //     <img
        //       loading="lazy"
        //       width="20"
        //       srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
        //       src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
        //       alt=""
        //     />
        //     {option.department_code} ({option.class_code}) - {option.title}
        //   </Box>
        // )}
    />
  );
}