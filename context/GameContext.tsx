import { useRouter } from "next/router";
import React, { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";


export const GameContext = createContext<{
    game: Game | null,
    setGame: Function, 
    requests: Array<Game>, 
    setRequests: Function,
    playerPoints: Array<string>,
    setPlayerPoints: Function
} | null>(null)

export const GameContextProvider = ({ children }: {children: JSX.Element}) => {
    const [game, setGame] = useState<Game | null>(null);
    const [requests, setRequests] = useState(Array<Game>())
    const [playerPoints, setPlayerPoints] = useState(Array<string>());

    const router = useRouter();

    const authContext = useContext(AuthContext);
    const user = authContext.user;

    return (
        <GameContext.Provider value={{game: game, setGame: setGame, 
                                    requests: requests, setRequests: setRequests, 
                                    playerPoints: playerPoints, setPlayerPoints: setPlayerPoints}}>
            {children}
        </GameContext.Provider>
    )
    
}