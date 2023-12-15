import studygroupService from '@/app/services/studygroup'

const getAllStudyGroups = async (user) => {
    try {
        const response = await studygroupService.getAll()
            .then((res) => res.json());
            console.log(response, 'getAllStudyGroups response')
        return response
    }
    catch (error) {
        console.log(error, 'studgroupService error');
    }
}

const createStudyGroup = async (newStudyGroupTitle, userCreator) => {
    if(newStudyGroupTitle == null || newStudyGroupTitle == undefined) {
        return  {
            ok: false,
            error,
            message: 'A group must have a name.',
        }
    }
        const response = await studygroupService
            .createStudyGroup(newStudyGroupTitle, userCreator).then((res) => res.json())
            
        if (response) {
            return response
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