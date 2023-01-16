import Link from "next/link";
import { useState } from "react";
import Button from "../Button";

function EndGameScreen({ game }: {game: Game}) {
    const [data, setData] = useState<Game>(JSON.parse(JSON.stringify(game)));

    const getPoints = (game: Game) => {
        const hostPoints = {
            count: 0,
            data: [false, false, false, false, false, false]
        };
        const playerPoints = {
            count: 0,
            data: [false, false, false, false, false, false]
        };
        for(let i = 0; i < 6; i++) {
            if(game.answers.host[i] === game.questions[i].correctAnswer) {
                hostPoints.count++;
                hostPoints.data[i] = true;
            }
            if(game.answers.player[i] === game.questions[i].correctAnswer) {
                playerPoints.count++;
                playerPoints.data[i] = true;
            }
        }

        return {
            host: hostPoints,
            player: playerPoints
        }
    }

    const [points, setPoints] = useState(getPoints(data));

    return (
        <>
            {data.mode === 'vs' ?
                <div className="w-full h-full flex flex-col justify-center items-center gap-16">
                    {points.host.count > points.player.count && <h1 style={{fontFamily: 'Bouncy'}} className='text-5xl text-green-500'>YOU WIN</h1>}
                    {points.host.count < points.player.count && <h1 style={{fontFamily: 'Bouncy'}} className='text-5xl text-red-500'>YOU LOST</h1>}
                    {points.host.count === points.player.count && <h1 style={{fontFamily: 'Bouncy'}} className='text-5xl text-orange-300'>DRAW</h1>}
                    <div className="w-96 text-primary-100 flex justify-around items-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <Button bgColor='bg-primary-300 text-3xl !text-primary-100' shadowColor="shadow-primary-400" width={'w-20 h-20'}>
                                <p>{points.host.count}</p>
                            </Button>
                            <p className="font-bold">YOU</p>
                        </div>
        
                        <div className="flex flex-col items-center justify-center gap-4">
                            <Button bgColor='bg-primary-300 text-3xl !text-primary-100' shadowColor="shadow-primary-400" width={'w-20 h-20'}>
                                <p>{points.player.count}</p>
                            </Button>
                            <p className="font-bold">OPPONENT</p>
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center">
                        <Link href="/">
                            <Button bgColor='bg-primary-300' shadowColor="shadow-primary-400" width={'w-96 h-20'}>
                                <p className="uppercase !text-primary-100 tracking-widest font-bold">Return to home page</p>
                            </Button>
                        </Link>
                    </div>
                </div>
            :
            <div className="w-full h-full flex flex-col justify-center items-center gap-16">
                <h1 style={{fontFamily: 'Bouncy'}} className='text-5xl text-green-500'>CONGRATULATIONS</h1>
                <div className="w-96 text-primary-100 flex justify-around items-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Button bgColor='bg-primary-300 text-3xl !text-primary-100' shadowColor="shadow-primary-400" width={'w-20 h-20'}>
                            <p>{points.host.count}</p>
                        </Button>
                        <p className="font-bold">YOUR POINTS</p>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center">
                    <Link href="/">
                        <Button bgColor='bg-primary-300' shadowColor="shadow-primary-400" width={'w-96 h-20'}>
                            <p className="uppercase !text-primary-100 tracking-widest font-bold">Return to home page</p>
                        </Button>
                    </Link>
                </div>
            </div>
            }
        </>
    )
}

export default EndGameScreen;