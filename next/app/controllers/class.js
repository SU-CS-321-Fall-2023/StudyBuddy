import classService from '@/app/services/class'

const get = async(query) => {
    const response = await classService.get(query).then((res) => res.json())
    return response.results
}

export default { get }