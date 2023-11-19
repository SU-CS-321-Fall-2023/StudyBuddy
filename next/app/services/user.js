
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

export default { update }