import { AuthContext } from '../../context/AuthContext';
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from '../../components/layout/Layout';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Countdown from '../../components/game/Countdown';
import Button from '../../components/Button';


// Update data
const updateData = async (gameID: string | undefined, selectedAnswer: string | null, question: Question | null, player: 'host' | 'player' | null) => {
    if(gameID && question && player) {
        if(player === 'host') {
            await updateDoc(doc(db, "games", gameID), {
                "data.host.answers": arrayUnion(selectedAnswer),
            })
        } else if(player === 'player') {
            await updateDoc(doc(db, "games", gameID), {
                "data.player.answers": arrayUnion(selectedAnswer),
            })
        }
    }
}


function GamePage() {
    const authContext = useContext(AuthContext);
    const user = authContext.user;

    const router = useRouter();
    const { id } = router.query;

    const [game, setGame] = useState<Game | null>(null);
    const [status, setStatus] = useState<'quiz' | 'results' | null>(null);
    const [questions, setQuestions] = useState<Array<Question> | null>(null);
    const [player, setPlayer] = useState<'host' | 'player' | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    useEffect(() => {
        if(game?.status === 'quiz') {
            setStatus('quiz');
        }
    }, [game?.status]);

    useEffect(() => {
        if(status === 'results') {
            if(questions) {
                updateData(game?.id, selectedAnswer, questions[0], player)
            }

            setTimeout(() => {
                const newQuestions = JSON.parse(JSON.stringify(questions)) as Array<Question>;
                newQuestions.shift();
                setQuestions(newQuestions);
                if(newQuestions.length >= 1) {
                    setSelectedAnswer(null);
                    setStatus('quiz');
                } else {
                    const endGame = async () => {
                        await updateDoc(doc(db, "games", game?.id as string), {
                            status: 'finished'
                        })
                    }
                    endGame();
                }
            }, 5000);
        }
    }, [status]);

    useEffect(() => {
        if(id) {
            const unsubscribe = onSnapshot(doc(db, "games", id as string), (doc) => {
                const game = doc.data() as Game;
                if(!game.players.includes(user?.uid as string)) {
                    router.push('/');
                }
                setGame(game);
                if(game.data.host.uid === user?.uid) setPlayer('host');
                else setPlayer('player');
            });

            return () => {
                unsubscribe();
            }
        }
    }, [id]);

    useEffect(() => {
        if(questions === null && game) {
            console.log('set questions');
            setQuestions(JSON.parse(JSON.stringify(game?.questions)) as Array<Question>);
        }
    }, [game]);

    const renderAnswerButton = (i: number) => {
        if(questions && player != null) {
            return (
                <>
                {status === 'quiz' ? 
                    <Button key={crypto.randomUUID()} onClick={() => setSelectedAnswer(questions[0].answers[i].id)} bgColor={`${selectedAnswer === questions[0].answers[i].id ? 'bg-primary-300/50' : 'bg-primary-300'}`} shadowColor="shadow-primary-400" width={'w-full min-h-[100px]'}>
                        <p>{questions[0].answers[i].content}</p>
                    </Button>
                :
                    <Button key={crypto.randomUUID()} bgColor={`${questions[0].correctAnswer === questions[0].answers[i].id ? 'bg-green-500' : 'bg-primary-300'}`} shadowColor={`${questions[0].correctAnswer === questions[0].answers[i].id ? 'shadow-green-700' : 'shadow-primary-400'}`} width={'w-full min-h-[100px]'}>
                        <p className='w-5/6'>{questions[0].answers[i].content}</p>
                    </Button>
                }
                </>
            )
        }
    }

    return (
        <Layout>
            <div className='w-full h-full flex flex-col justify-center items-center gap-4'>
                {game?.status === 'waiting' ?
                    <div>waiting</div>    
                :
                    <div className='w-full h-full'>
                        {game?.status === 'quiz' ?
                            <div className='w-full h-full flex flex-col items-center justify-between gap-4'>
                                <Countdown questions={questions} mode={status} setMode={setStatus}></Countdown>
                                <div className='w-full h-full md:p-4 flex flex-col gap-4'>
                                    {/* Players points and profiles */}
                                    <div>

                                    </div>

                                    {/* Question with answers */}
                                    {questions && <div className='w-full flex flex-col items-center justify-center gap-16'>
                                        <h1 className='text-2xl font-bold'>{questions[0].question}</h1>
                                        <div className='w-full grid gap-4 grid-cols-1 md:grid-cols-2'>
                                            {[...Array(4)].map((e, i) => renderAnswerButton(i))}
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        :   
                            <>
                                {game?.status === 'finished' && <div>end screen</div>}
                            </>
                        }
                    </div>
                }
            </div>
        </Layout>
    )
}

export default GamePage;