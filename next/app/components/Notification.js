'use client'
import { useNotificationContext } from "@/app/contexts/NotificationContext"
import { Alert } from "@material-tailwind/react";

const Notification = () => {

  const { message, messageType } = useNotificationContext()

  if (message === null || message === '') {
    return null
  }

  var messageColor;
  if (messageType === 'success') {
    messageColor = 'green'
  }
  else if (messageColor = 'error') {
    messageColor = 'red'
  }

  return (
    <div className="max-w-md mx-auto mt-4">
      <div className="flex w-full flex-col gap-2">
        <Alert color={messageColor}>{message}</Alert>
      </div>
    </div>
  )
}

export default Notification