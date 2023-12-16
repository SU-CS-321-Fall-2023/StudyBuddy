import apiBaseUrl from '@/app/services'

const chatApiUrl = `${apiBaseUrl}`

//fetch chat
const getAllChat = async (user) => {
  //console.log('user', user.id)
  const response = await fetch(`${chatApiUrl}/chat/mychats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user: user }),
  });
  return response
}

//get chat
const getChat = async (chatId) => {
  const response = await fetch(`${chatApiUrl}/chat/${chatId}`)
  return response;
}

//create chat
const createChat = async (senderId, receiverId) => {
  const response = await fetch(`${chatApiUrl}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat: {
        senderId: senderId,
        receiverId: receiverId,
        timestamp: Date.now()
      }
    }),
  });

  return response
}

const getSenderReceiverChat = async (senderId, receiverId) => {
  const response = await fetch(`${chatApiUrl}/private-chat/senderreceiverchat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        senderId: senderId,
        receiverId: receiverId
    }),
  });

  return response
}

export default { getAllChat, createChat, getChat, getSenderReceiverChat }
