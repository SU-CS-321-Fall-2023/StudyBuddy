import axios from 'axios'

const baseUrl = 'https://sb-node.onrender.com/v1/auth/register'

const register = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { register }