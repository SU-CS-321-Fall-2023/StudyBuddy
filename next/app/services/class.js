import apiBaseUrl from '@/app/services'
const classesApiUrl = `${apiBaseUrl}/classes`

const get = async(query) => {
    const url = query ? `${classesApiUrl}?search=${query}` : classesApiUrl
    const response = await fetch(url)
    return response
}


export default { get }