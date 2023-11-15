import axios from 'axios'

const baseUrl = 'https://sb-node.onrender.com/v1/auth'

const register = async credentials => {
  const url = `${baseUrl}/register`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  };
  
  const response = await fetch(url, options);
  const data = await response.json();

  return data;
}

export default { register }