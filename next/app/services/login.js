// extract login.js and register.js into auth.js and add it to user controller
import apiBaseUrl from '@/app/services'

const authApiUrl = `${apiBaseUrl}/auth`

const login = async (credentials) => {
  const url = `${authApiUrl}/login`;
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

export default { login }