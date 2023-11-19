// make baseurl an environment variable
const update = async (user, token, newObject) => {
    const baseUrl = `http://localhost:3000/v1/users/${user.id}`
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
    const response = await fetch(`https://sb-node.onrender.com/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token?.replace(/"/g, '')}`,
        },
      });

    //   const recievedUser = await response.json();
    return response
}

export default { update, get }