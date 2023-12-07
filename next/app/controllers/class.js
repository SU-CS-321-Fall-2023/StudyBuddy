import classService from '@/app/services/class'

const get = async(query) => {
    try {
        const response = await classService.get(query).then((res) => res.json())
        return response.results
    } catch (error) {
        console.log(error, 'classService error')
    }
}

export default { get }