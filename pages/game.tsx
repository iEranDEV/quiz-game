import { useContext, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Layout from "../components/layout/Layout";
import { AuthContext } from "../context/AuthContext";
import { GameContext } from "../context/GameContext";
import { WebContext } from "../context/WebContext";

function GamePage() {

    const authContext = useContext(AuthContext);
    const webContext = useContext(WebContext);
    const gameContext = useContext(GameContext);
    const game = gameContext?.game;

    useEffect(() => {
        console.log(gameContext?.game);
    }, [])


    return (
        <Layout>
            {game?.loading ? 
                <div className='w-full h-full flex flex-col gap-4 justify-center items-center'>
                    <AiOutlineLoading3Quarters className='w-10 h-10 text-primary-100 animate-spin'></AiOutlineLoading3Quarters>
                    <p className="text-primary-100">Waiting for opponent</p>
                </div> 
            :   
                <div>
                    game
                </div>
            }
        </Layout>
    )
}

export default GamePage;