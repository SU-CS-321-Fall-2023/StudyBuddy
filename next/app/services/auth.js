// extract login.js and register.js into auth.js and add it to user controller
import apiBaseUrl from '@/app/services'

const authApiUrl = `${apiBaseUrl}/auth`

const login = async options => {
  const url = `${authApiUrl}/login`;
  const response = await fetch(url, options).then(res => res.json())

  return response;
}

const register = async options => {
    const url = `${authApiUrl}/register`;
    
    const response = await fetch(url, options).then(res => res.json())
    return response;
  }

export default { login, register }