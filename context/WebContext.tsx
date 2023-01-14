import React, { createContext, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { AuthContext } from "./AuthContext";


// Declaration of auth context
export const WebContext = createContext<null>(null)

export const WebContextProvider = ({ children }: {children: JSX.Element}) => {
    let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

    const authContext = useContext(AuthContext);
    const user = authContext.user;

    useEffect(() => {
        if(user) {
            const socketInitializer = async () => {
                await fetch('/api/socket?uid=' + user?.uid);
                socket = io();

                if(socket) {
                    socket.on('connect', () => {
                        console.log('client - connected')
                    })
    
                    socket.on('friends-activity', () => {
                        
                    })
                }
            }
            socketInitializer();
        }
    }, [user]);

    return (
        <WebContext.Provider value={null}>
            {children}
        </WebContext.Provider>
    )
    
}