import userService from '@/app/services/user';
import { useNotificationContext } from "@/app/contexts/NotificationContext";

const update = async (user, token, classObj) => {
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

export default { update };
