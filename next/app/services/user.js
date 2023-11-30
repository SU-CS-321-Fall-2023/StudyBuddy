import apiBaseUrl from '@/app/services'

const userApiUrl = `${apiBaseUrl}/users`

const update = async (user, token, newObject) => {
    const baseUrl = `${userApiUrl}/${user.id}`
        const response = await fetch(baseUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.replace(/"/g, '')}`,
        },
        
        body: JSON.stringify(newObject),
        })

        return response
}

// TODO: seperate the concern of reformatting the token from service
const get = async(userId, token) => {
    const response = await fetch(`${userApiUrl}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token?.replace(/"/g, '')}`,
        },
      });

    //   const recievedUser = await response.json();
    return response
}

const getAll = async() => {
  const response = await fetch(`${userApiUrl}/?limit=1000`);
  return response
}

export default { update, get, getAll}