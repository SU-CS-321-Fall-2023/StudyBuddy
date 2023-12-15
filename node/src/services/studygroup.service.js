const { StudyGroup } = require('../models')
const userService = require('./user.service')
/**
 * Create a study group
 * @param {Object} studygroup
 * @returns {Promise<StudyGroup>}
 */

const createStudyGroup = async (studygroup) => {

    const newObj = studygroup.newGroupBody
    // Create a new study group
    const newGroup = await StudyGroup.create(newObj);

    // Ensure userCreator.id is a valid ObjectId
    const userCreatorId = studygroup.userCreator.id;

    // Push the userCreatorId to the users array of the new group
    newGroup.users.push(userCreatorId);
    await newGroup.save();

    // Update the userCreator with the new study group ID
    const userCreator = await userService.getUserById(userCreatorId);
    userCreator.studyGroups.push(newGroup);
    await userCreator.save();

    return {
        newGroup: newGroup,
        user: userCreator
    };
};


/**
 * Create a study group
 * @param {ObjectId} userId
 * @returns {Promise<StudyGroup>}
 */

const getStudyGroups = async() => {
    return await StudyGroup.find({});
}

/**
 * Create a study group
 * @param {ObjectId}} studygroupId
 * @param {ObjectId} userId
 * @returns {Promise<StudyGroup>}
 */

const joinStudyGroup = async(studygroupId, userId) =>{
    console.log(studygroupId, userId, 'studygroup service')
    const studyGroup = await StudyGroup.findById(studygroupId);
    studyGroup.users.push(userId);
    await studyGroup.save();
    const user = await userService.getUserById(userId);
    user.studyGroups.push(studyGroup);
    await user.save();
    const updatedStudyGroups = await StudyGroup.find({});
    return {
        ok: true,
        body: {
            updatedStudyGroups: updatedStudyGroups,
            updatedUser: user
        },
        message: 'You have joined the group.',
    }
}

/**
 * search for study group
 * @param {String} groupname
 * @returns {Promise<StudyGroup>}
 */

const searchStudyGroup = async(groupname) => {
    const queryStrings = groupname.query.split(" ")
    allQueries =[]

    queryStrings.forEach(element => {
        allQueries.push({name : {$regex : String(element)}})
    });
    return await StudyGroup.find({$or : allQueries})
}

module.exports = {
    createStudyGroup,
    joinStudyGroup,
    searchStudyGroup,
    getStudyGroups
}