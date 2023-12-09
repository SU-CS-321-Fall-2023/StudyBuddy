const { StudyGroup } = require('../models')

/**
 * Create a study group
 * @param {Object} studygroup
 * @returns {Promise<StudyGroup>}
 */

const createStudyGroup = async(studygroup) => {
    
    
    return await StudyGroup.create(studygroup);
}

/**
 * Create a study group
 * @param {ObjectId} userId
 * @returns {Promise<StudyGroup>}
 */

const getStudyGroups = async(userId) => {
    return await StudyGroup.find({ users: userId});
}

/**
 * Create a study group
 * @param {ObjectId}} studygroupId
 * @param {ObjectId} userId
 * @returns {Promise<StudyGroup>}
 */

const joinStudyGroup = async(studygroupId, userId) =>{
    return await StudyGroup.findByIdAndUpdate(
        studygroupId,
        { $push: { users: userId }},
        { new: true, useFindAndModify: false }
    );
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