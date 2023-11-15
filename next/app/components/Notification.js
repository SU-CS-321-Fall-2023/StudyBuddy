'use client'
import { useNotificationContext } from "../contexts/NotificationContext"

const Notification = () => {

  const { message, messageType } = useNotificationContext()

  if (message === null || message === '') {
    return null
  }

  return (
    <div className={messageType}>
      {message}
    </div>
  )
}

export default Notification