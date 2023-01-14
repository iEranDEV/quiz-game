import React, { useState, createContext } from "react";


// Declaration of auth context
export const NotificationContext = createContext<{notifications: Array<INotification>, addNotification: Function, setNofifications: Function}>({
    notifications: Array<INotification>(),
    addNotification: () => {},
    setNofifications: () => {}
})

export const NotificationContextProvider = ({ children }: {children: JSX.Element}) => {

    // State instance
    const [notifications, setNofifications] = useState(Array<INotification>());

    const addNotificationState = (notification: INotification) => {
        const newNotifications = [...notifications, notification];
        setNofifications(newNotifications);
    }

    return (
        <NotificationContext.Provider value={{notifications: notifications, addNotification: addNotificationState, setNofifications: setNofifications}}>
            {children}
        </NotificationContext.Provider>
    )
    
}