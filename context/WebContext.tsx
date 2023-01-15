import React, { createContext, useEffect, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { AuthContext } from "./AuthContext";


// Declaration of auth context
export const WebContext = createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)

export const WebContextProvider = ({ children }: {children: JSX.Element}) => {
    const [socket, setSocket] = useState<any | null>(null);

    const authContext = useContext(AuthContext);
    const user = authContext.user;

    useEffect(() => {
        if(user) {
            const socketInitializer = async () => {
                await fetch('/api/socket');
                setSocket(io());
            }
            socketInitializer();
        }
    }, [user]);

    useEffect(() => {
        if(socket && user) {
            socket.emit('user_connect', user.uid);

            socket.on('connect', () => {
                console.log('client - connected')
            })
        }
    }, [socket])

    return (
        //@ts-ignore
        <WebContext.Provider value={socket}>
            {children}
        </WebContext.Provider>
    )
    
}