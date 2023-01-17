import Pusher, { Channel } from "pusher-js";
import React, { createContext, useEffect, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { GameContext } from "./GameContext";
import axios from 'axios';


// Declaration of auth context
export const WebContext = createContext<{instance: Pusher | null, channel: Channel | undefined}>({
    instance: null,
    channel: undefined,
});

export const WebContextProvider = ({ children }: {children: JSX.Element}) => {
    const [instance, setInstance] = useState<Pusher | null>(null);
    const [channel, setChannel] = useState<Channel | undefined>(undefined);
    const [userChannel, setUserChannel] = useState<Channel | undefined>(undefined);

    const authContext = useContext(AuthContext);
    const gameContext = useContext(GameContext);
    const user = authContext.user;
    const game = gameContext?.game;

    useEffect(() => {
        if(user) {
            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, { cluster: 'eu' })
            setInstance(pusher);
            const userChannel = pusher.subscribe(user.uid);

            userChannel.bind("send_request", (data: any) => {
                gameContext?.setRequests([...gameContext.requests, data.data]);
            })

            setUserChannel(userChannel);
            


            const connect = async () => {
                await axios.post('/api/socket', { type: 'connect', id: user.uid});
            }
            connect();
        }

        return () => {
            if(instance) {
                instance.unsubscribe(user?.uid as string);
                instance.disconnect();
            }
        }
    }, [user]);

    useEffect(() => {
        if(game && user && game.mode === 'vs') {
            const channel = instance?.subscribe(game.id);
            setChannel(channel);

            userChannel?.bind("start_game", (id: {id: string}) => {
                const startGame = (id: {id: string}) => {
                    if(game?.id === id.id) {
                        const newGame = JSON.parse(JSON.stringify(game)) as Game;
                        newGame.loading = false;
                        gameContext?.setGame(newGame);
                    }
                }
                startGame(id);
            })

            userChannel?.bind('update', (data: {playerPoints: Array<string>}) => {
                gameContext.setPlayerPoints(data.playerPoints);
            })

            return () => {
                instance?.unsubscribe(game.id);
                setChannel(undefined);
            }
        }
    }, [game]);

    return (
        //@ts-ignore
        <WebContext.Provider value={{instance: instance, channel: channel}}>
            {children}
        </WebContext.Provider>
    )
    
}