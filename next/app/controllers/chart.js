import groupMessagesService from '@/app/services/chart'

const getGroupMessages = async (groupId) => {
    if(groupId == null || groupId == undefined) {
        return {
            ok: false,
            message: 'Group has not been specified.',
        }
    }
    try {
        const response = await groupMessagesService.getGroupMessages(groupId)
            .then((res) => res.json());
            console.log(response)
        return response
    }
    catch (error) {
        console.log(error, 'groupMessagesService error');
    }
}

export default { getGroupMessages }