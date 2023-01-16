import { useRouter } from "next/router";
import React, { createContext, useEffect, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { AuthContext } from "./AuthContext";
import { GameContext } from "./GameContext";
import { NotificationContext } from "./NotificationContext";


// Declaration of auth context
export const WebContext = createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)

export const WebContextProvider = ({ children }: {children: JSX.Element}) => {
    const [socket, setSocket] = useState<any | null>(null);

    const authContext = useContext(AuthContext);
    const gameContext = useContext(GameContext);
    const notificationContext = useContext(NotificationContext);
    const user = authContext.user;

    const router = useRouter();

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
            });

            socket.on('game_request', (game: Game) => {
                gameContext?.setRequests([...gameContext.requests, game]);
            });

            socket.on('start_game', (game: Game) => {
                const newGame = JSON.parse(JSON.stringify(game)) as Game;
                newGame.loading = false;
                gameContext?.setGame(newGame);
                gameContext?.setPlayerPoints([]);
            });

            socket.on('game_update', (game: Game) => {
                gameContext?.setPlayerPoints(game.answers.host);
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