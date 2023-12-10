import apiBaseUrl from '@/app/services'
import { userController } from '../controllers';
const studygroupApiUrl = `${apiBaseUrl}/studygroups`

//fetch user study groups
const getAll = async (userId) => {
  const response = await fetch(`${studygroupApiUrl}/mygroups`)
  return response
}

//create studygroup
const createStudyGroup = async (studygroupname, userCreator) => {
  try {
  const response = await fetch(`${studygroupApiUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userCreator: userCreator, newGroupBody: {name: studygroupname } }),
  });

  return response
  } catch (error) {
    return {
      ok: false,
      error,
      message: 'Failed to create study group. Please try again.',
    };
  }
}

//join studygroup
const joinStudyGroup = async (studygroupId, userId) => {
  const response = await fetch(`${studygroupApiUrl}/${studygroupId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user: { id: userId } }),
  });

  console.log(response, 'joinStudyGroup response')
  return response
}

//search studygroup
const searchGroup = async (query) => {
  const url = query ? `${studygroupApiUrl}/search?query=${query}` : studygroupApiUrl;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response
}

export default { getAll, createStudyGroup, joinStudyGroup, searchGroup }