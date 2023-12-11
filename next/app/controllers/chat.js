import chatService from '@/app/services/chat'

const createChat = async (senderId, receiverId) => {
    if(senderId == null || senderId == undefined) {
        return  {
            ok: false,
            error,
            message: 'Chat must have a sender.',
        }
    }

    if(receiverId == null || receiverId == undefined) {
        return  {
            ok: false,
            error,
            message: 'Chat must have a receiver.',
        }
    }
        const response = await chatService
            .createChat(senderId, receiverId).then((res) => res.json())
            
        if (response) {
            return response
        }
}

const getAllChats = async (user) => {
    try {
        const response = await chatService.getAllChat(user)
            .then((res) => res.json());

        return response
    }
    catch (error) {
        console.log(error, 'getAllChat response');
    }
}

const getChat = async (messageId) => {
    try {
        const response = await chatService.getChat(messageId)
            .then((res) => res.json());

        return response
    }
    catch (error) {
        console.log(error, 'getChat response');
    }
}


const getSenderReceiverChat= async (user, receiver) => {
    console.log('send', user.id, receiver.id)
    try {
        const response = await chatService.getSenderReceiverChat(user.id, receiver.id)
            .then((res) => res.json());
        console.log('res1', response)
        return response
    }
    catch (error) {
        console.log(error, 'getChat response');
    }
}

export default { createChat, getAllChats, getChat, getSenderReceiverChat }