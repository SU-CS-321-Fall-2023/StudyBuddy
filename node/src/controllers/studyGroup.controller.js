const httpStatus = require('http-status')
const { studygroupService } = require('../services')
const catchAsync = require('../utils/catchAsync')
const mongoose = require('mongoose');

const createStudyGroup = catchAsync(async(req, res) => {
    const studygroup = await studygroupService.createStudyGroup(req.body)
    res.status(httpStatus.CREATED).send(studygroup)
})

const getStudyGroups = catchAsync(async(req, res) => {
    const id = mongoose.Types.ObjectId(req.body.user.id);
    const studyGroups = await studygroupService.getStudyGroups(id)
    res.send(studyGroups)
})

const joinStudyGroup = catchAsync(async(req, res) => {
    const studygroup = await studygroupService.joinStudyGroup(
        req.params.studygroupId, req.body.user.id
    )

    res.send(studygroup)
})

const searchStudyGroup = catchAsync(async(req, res) => {
    const studygroup = await studygroupService.searchStudyGroup(req.query)
    if(!studygroup || studygroup.length === 0) res.status(
            httpStatus.NOT_FOUND).send({error : "No group was found"})

    res.status(httpStatus.OK).send(studygroup)
})

module.exports = {
    createStudyGroup,
    joinStudyGroup,
    searchStudyGroup,
    getStudyGroups
}