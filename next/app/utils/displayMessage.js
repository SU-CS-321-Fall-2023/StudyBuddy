import { useNotificationContext } from "../contexts/NotificationContext";

function displayMessage(message, messageType, duration = 5000) {
    const { setMessage, setMessageType } = useNotificationContext();
    setMessage(message);
    setMessageType(messageType);
  
    setTimeout(() => {
      setMessage(null);
    }, duration);
  }
  
  displayMessage('Successfully logged in', 'success');

export default displayMessage;