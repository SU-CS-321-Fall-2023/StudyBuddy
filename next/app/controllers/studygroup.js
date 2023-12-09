import studygroupService from '@/app/services/studygroup'

const getAllStudyGroups = async (user) => {
    if(user == null || user == undefined) {
        return {
            ok: false,
            message: 'Kindly provide more details to view groups.',
        }
    }
    try {
        const response = await studygroupService.getAll(user.id)
            .then((res) => res.json());
            console.log(response)
        return response
    }
    catch (error) {
        console.log(error, 'studgroupService error');
    }
}

const createStudyGroup = async (name) => {
    if(name == null || name == undefined) {
        return  {
            ok: false,
            error,
            message: 'A group must have a name.',
        }
    }
    try {
        const response = await studygroupService
            .createStudyGroup(name)
            .then((res) => res.json());
        
    } catch (error) {
        return {
            ok: false,
            error,
            message: 'Failed to create studygroup. Please try again.',
        }
    }
}

const joinStudyGroup = async(studygroup, user) => {
    // Check if user is in the group
    if (studygroup && studygroup.users.includes(user.id)) {
        return {
            ok: false,
            message: 'You already joined the group!',
        };
    }

    try {
        const response = await studygroupService
            .joinStudyGroup(studygroup._id, user.id)
            .then((res) => res.json())

        if (response.ok) {
            return {
                ok: true,
                body: response,
                message: 'You have joined the group.',
            };
        }
    } catch (error) {
        return {
            ok: false,
            error,
            message: 'Problem joining the group. Please try again.',
        }
    }
}

const searchStudyGroup = async (query) => {
    try {
        const response = await studygroupService
            .searchGroup(query)
            .then((res) => res.json())
        return {
            ok: true,
            body: response,
        };
    } catch (error) {
        return {
            ok: false,
            error,
            message: 'Problem performing search. Please try again.',
        }
    }
}

export default {
    getAllStudyGroups,
    createStudyGroup,
    joinStudyGroup,
    searchStudyGroup
}