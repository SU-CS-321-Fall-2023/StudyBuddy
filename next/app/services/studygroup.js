import apiBaseUrl from '@/app/services'

const studygroupApiUrl = `${apiBaseUrl}/studygroups`

//fetch user study groups
const getAll = async (userId) => {
  const response = await fetch(`${studygroupApiUrl}/${userId}`);
  return response
}

//create studygroup
const createStudyGroup = async (studygroupname) => {
  const response = await fetch(`${studygroupApiUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: studygroupname }),
  });

  return response
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

  response.log('response', response)
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