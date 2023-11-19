import apiBaseUrl from '@/app/services'

const authApiUrl = `${apiBaseUrl}/auth`

const register = async credentials => {
  const url = `${authApiUrl}/register`;
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