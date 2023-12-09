import apiBaseUrl from '@/app/services'

const groupChartApiUrl = `${apiBaseUrl}/chart`

//fetch group messages
const getGroupMessages = async (groupId) => {
  const response = await fetch(`${groupChartApiUrl}/${groupId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response
}

export default { getGroupMessages }
