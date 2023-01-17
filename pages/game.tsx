import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";
import Button from "../components/Button";
import Countdown from "../components/game/Countdown";
import EndGameScreen from "../components/game/EndGameScreen";
import Layout from "../components/layout/Layout";
import { AuthContext } from "../context/AuthContext";
import { GameContext } from "../context/GameContext";
import { WebContext } from "../context/WebContext";
import { db } from "../firebase";

function GamePage() {

    const authContext = useContext(AuthContext);
    const user = authContext.user;
    const webContext = useContext(WebContext);
    const gameContext = useContext(GameContext);
    const game = gameContext?.game;
    const router = useRouter();

    const [questions, setQuestions] = useState<Array<Question> | null>(null);
    const [mode, setMode] = useState<'quiz' | 'results'>('quiz');
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [opponent, setOpponent] = useState<User | null>();

    useEffect(() => {
        if(!game) router.push('/');
        else {
            setQuestions(JSON.parse(JSON.stringify(game?.questions)) as Array<Question>);
        }
    }, []);

    const nextQuestion = () => {
        const newQuestions = JSON.parse(JSON.stringify(questions)) as Array<Question>;
        newQuestions.shift();
        setQuestions(newQuestions);
        setMode('quiz');
    }

    useEffect(() => {
        if(game?.player) {
            const syncOpponent = async () => {
                const docSnap = await getDoc(doc(db, "users", game.player as string));
                if(docSnap.exists()) {
                    setOpponent(docSnap.data() as User);
                }
            }
            syncOpponent();
        }
    }, [game?.player]);

    useEffect(() => {
        if(game?.loading === false) {
            if(mode === 'results') {
                const newGame = JSON.parse(JSON.stringify(game)) as Game;
                if(selectedAnswer)  newGame.answers.host.push(selectedAnswer);
                else newGame.answers.host.push('');
                if(game.mode === 'vs') {
                    const sendUpdate = async () => {
                        console.log('sent update')
                        await axios.post('/api/socket', {type: 'update', data: newGame});
                    }
                    sendUpdate();
                }
                gameContext?.setGame(newGame);
                setTimeout(() => {
                    if(questions && questions.length > 0) {
                        nextQuestion();
                        setSelectedAnswer(null);
                        setMode('quiz');
                    }
                }, 3000)
            }
        }
    }, [mode])

    const getAnswerData = (index: number, arr: Array<string>) => {
        if(index >= arr.length) {
            return 'text-stone-400';
        } else if(game?.questions[index].correctAnswer === arr[index]) {
            return 'text-green-500';
        } else {
            return 'text-red-500';
        }
    }

    return (
        <Layout>
            {game?.loading ? 
                (<div className='w-full h-full flex flex-col gap-4 justify-center items-center'>
                    <AiOutlineLoading3Quarters className='w-10 h-10 text-primary-100 animate-spin'></AiOutlineLoading3Quarters>
                    <p className="text-primary-100">Waiting for opponent</p>
                </div>)
            :   
                <>
                    {questions &&questions.length > 0 && game ? 
                        <div className="w-full h-full flex flex-col gap-2 py-4">
                            <Countdown questions={questions} setQuestions={setQuestions} mode={mode} setMode={setMode}></Countdown>
                            <div className="w-full flex justify-between items-center">
                                {/* User data */}
                                <div className="flex gap-4">
                                    {user?.photoURL && <img src={user.photoURL} className='w-10 h-10 rounded-full' />}
                                    <div className="flex flex-col justify-between h-10">
                                        <p>{user?.username}</p>
                                        <div className="flex gap-2">
                                            {Array.from(Array(6), (e, i) => {
                                                return <BsCircleFill key={i} className={`h-2 w-2 ${getAnswerData(i, game.answers.host)}`}></BsCircleFill>
                                            })}
                                        </div>
                                    </div>
                                </div>
                
                                {/* Other player data */}
                                {game.player && <div className="flex gap-4 items-end">
                                    <div className="flex flex-col justify-between items-end h-10">
                                        <p>{opponent?.username}</p>
                                        <div className="flex gap-2">
                                            {Array.from(Array(6), (e, i) => {
                                                return <BsCircleFill key={i} className={`h-2 w-2 ${getAnswerData(i, gameContext.playerPoints)}`}></BsCircleFill>
                                            })}
                                        </div>
                                    </div>
                                    {opponent?.photoURL && <img src={opponent.photoURL} className='w-10 h-10 rounded-full' />}
                                </div>}
                            </div>
                            <div className="w-full flex justify-center items-center text-lg h-60">
                                {questions[0].question}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {questions[0].answers.map((item) => {
                                    return (
                                        <>
                                            {mode === 'quiz' ?
                                                <Button onClick={() => setSelectedAnswer(item.id)} key={item.id} bgColor={`${selectedAnswer === item.id ? 'bg-primary-400/50 text-green-500' : 'bg-primary-300'}`} shadowColor="shadow-primary-400" width={'w-full h-20'}>
                                                    <p>{item.content}</p>
                                                </Button>
                                            :
                                                <Button key={item.id} bgColor={`${questions[0].correctAnswer === item.id ? 'bg-green-500 text-stone-50' : 'bg-primary-300 text-primary-100'}`} shadowColor={`${questions[0].correctAnswer === item.id ? 'shadow-green-700' : 'shadow-primary-400'}`} width={'w-full h-20'}>
                                                    <p>{item.content}</p>
                                                </Button>
                                            }
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    :
                        <EndGameScreen game={JSON.parse(JSON.stringify(game)) as Game}></EndGameScreen>
                    }
                </>
            }
        </Layout>
    )
}

export default GamePage;