
const get = async(query) => {
    const baseUrl = 'https://sb-node.onrender.com/v1/classes'
    const url = query ? `${baseUrl}?search=${query}` : baseUrl
    const response = await fetch(url)
    return response
}


export default { get }