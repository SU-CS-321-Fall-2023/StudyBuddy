import userService from '@/app/services/user';
import { useNotificationContext } from "@/app/contexts/NotificationContext";

const get = async (query, token) => {
    // TODO: trigger a notification if response is not ok
    try {
        const response = await userService.get(query, token).then((res) => res.json());
        if (response.id) {
            return response
        } else {
            console.log(response, 'userService Error')
        }
    } catch (error) {
        console.log(error, 'userService error');
    }
}

const getAll = async () => {
    try {
        const response = await userService.getAll().then((res) => res.json());
        return response
    }
    catch (error) {
        console.log(error, 'userService error');
    }
}

const toggleEmailNotifications = async (user, token) => {
    try {
      // Toggle the value of emailPreferences.notifications
      const updatedBody = {
        emailPreferences: {
          notifications: !user.emailPreferences.notifications,
        },
      };
  
      // Update the user with the new body
      const response = await userService.update(user, token, updatedBody);
  
      if (response.ok) {
        const updatedUser = await response.json();
        return {
          ok: true,
          body: updatedUser,
          message: `Email notifications are now ${updatedUser.emailPreferences.notifications ? 'enabled' : 'disabled'}.`,
        };
      } else {
        return {
          ok: false,
          message: 'Failed to update email notifications. Please try again.',
        };
      }
    } catch (error) {
      return {
        ok: false,
        error,
        message: 'Failed to update email notifications. Please try again.',
      };
    }
  };  


const getUserByEmail = async (email) => {
    try {
        const response = await userService.getUserByEmail(email).then((res) => res.json());
        return response
    }
    catch (error) {
        console.log(error, 'userService error');
    }
}

// give it better name like addClass
const addClass = async (user, token, classObj) => {
    try {
        // Check if class is already in user classes
        const transformedClasses = user.classes.map((classObj) => classObj.id);
        if (classObj && transformedClasses.includes(classObj.id)) {
            return {
                ok: false,
                message: 'You already have this class!',
            };
        }

        if (!classObj) {
            return {
                ok: false,
                message: 'Please select a class to add',
            };
        }

        // If not, add it
        const newObject = {
            classes: [...transformedClasses, classObj.id],
        };
        const response = await userService.update(user, token, newObject);
        if (response.ok) {
            return {
                ok: true,
                body: await response.json(),
                message: `Successfully added ${classObj.department_code} ${classObj.class_code} to your classes`,
            };
        }
    } catch (error) {
        return {
            ok: false,
            error,
            message: 'Failed to update classes. Please try again.',
        };
    }

    return {
        ok: false,
        message: 'Failed to update classes. Please try again.',
    };
};

const removeClass = async (user, token, classObj) => {
    try {
        // Check if class is already not in user classes
        const transformedClasses = user.classes.map((classObj) => classObj.id);
        if (classObj && !transformedClasses.includes(classObj.id)) {
            console.log(consoleObj, 'consoleObj')
            console.log(transformedClasses, 'transformedClasses')
            return {
                ok: false,
                message: 'Class is not added to your profile',
            };
        }

        if (!classObj) {
            return {
                ok: false,
                message: 'Please select a class to remove',
            };
        }

        // If not, remove it
        const newObject = {
            classes: transformedClasses.filter((classId) => classId !== classObj.id),
        };
        const response = await userService.update(user, token, newObject);
        if (response.ok) {
            return {
                ok: true,
                body: await response.json(),
                message: `Successfully removed ${classObj.department_code} ${classObj.class_code} from your classes`,
            };
        }
    } catch (error) {
        console.log(error, 'error')
        return {
            ok: false,
            error,
            message: 'Failed to update classes. Please try again.',
        };
    }

    return {
        ok: false,
        message: 'Failed to update classes. Please try again.',
    };
};

const sendFriendRequest = async (senderUser, recipientUser) => {
    const response = await userService.sendFriendRequest(senderUser, recipientUser);
    return response
}

const acceptFriendRequest = async (accepterUser, requesterUser) => {
    const response = await userService.acceptFriendRequest(accepterUser, requesterUser);
    return response
}

const cancelFriendRequest = async (cancelerUser, recipientUser) => {
    try {
        const token = 'token'
        if (recipientUser && recipientUser.friendRequests.includes(cancelerUser.id)) {
            const newObject = {
                friendRequests: recipientUser.friendRequests.filter((id) => id.toString() !== cancelerUser.id.toString()),
            };
            const response = await userService.update(recipientUser, token, newObject);
            if (response.ok) {
                return {
                    ok: true,
                    body: await response.json(),
                    message: `Successfully cancelled friend request to ${recipientUser.name}`,
                };
            }
        }
    } catch (error) {
        return {
            ok: false,
            error,
            message: 'Failed to cancel friend request. Please try again.',
        };
    }
}

const removeFriend = async (removerUser, removeeUser) => {
    try {
        const token = 'token'
        const transformedRemoverIds = removerUser.friends.map((friendObj) => friendObj.id);
        console.log(removerUser, 'removerUser')
        console.log(removeeUser, 'removeeUser')
        if (!removeeUser) {
            return {
                ok: false,
                message: 'Please select a friend to remove',
            };
        }
        if (!transformedRemoverIds.includes(removeeUser.id)) {
            return {
                ok: false,
                message: 'Friend is not added to your profile',
            };
        }
        if (removeeUser && removeeUser.friends.includes(removerUser.id)) {
            const newRemoveeObject = {
                friends: removeeUser.friends.filter((id) => id.toString() !== removerUser.id.toString()),
            };
            const newRemoverObject = {
                friends: transformedRemoverIds.filter((id) => id.toString() !== removeeUser.id.toString()),
            };
            const response = await userService.update(removeeUser, token, newRemoveeObject);
            const response2 = await userService.update(removerUser, token, newRemoverObject);
            console.log (response2, 'response2')
            if (response.ok && response2.ok) {
                return {
                    ok: true,
                    body: await response2.json(),
                    message: `Successfully removed ${removeeUser.name} from your friends`,
                };
            }
        }
    }
    catch (error) {
        return {
            ok: false,
            error,
            message: 'Failed to remove friend. Please try again.',
        };
    }
}


export default { get,
    getAll,
    addClass,
    removeClass,
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    removeFriend,
    toggleEmailNotifications,
    getUserByEmail
 };
