import Button from "../Button";
import Modal from "./Modal";
import { GrGamepad } from 'react-icons/gr';
import { useContext, useEffect, useState } from "react";
import { FiUser, FiUsers } from 'react-icons/fi';
import { FaRegSadTear } from "react-icons/fa";
import { WebContext } from "../../context/WebContext";
import { AuthContext } from "../../context/AuthContext";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { BsCheckLg } from "react-icons/bs";
import { GameContext } from "../../context/GameContext";
import { useRouter } from "next/router";

function GameModal({ category, setMenu }: {category: Category, setMenu: Function}) {
    const [mode, setMode] = useState<'solo' | 'vs'>('solo');
    const [onlineFriendsIDS, setOnlineFriendsIDS] = useState(Array<string>());
    const [onlineFriends, setOnlineFriends] = useState(Array<User>());
    const [selectedFriend, setSelectedFriend] = useState<User | null>(null);

    const router = useRouter();
    const webContext = useContext(WebContext);
    const authContext = useContext(AuthContext);
    const gameContext = useContext(GameContext);
    const user = authContext.user;

    useEffect(() => {
        if(mode === 'vs' && user) {
            webContext?.emit('get_friends_activity', user.friends, (response: any) => {
                setOnlineFriendsIDS(response);
            });
        }
    }, [mode])

    const syncFriendsData = async () => {
        const arr = Array<User>();
        for(const friend of onlineFriendsIDS) {
            const docSnap = await getDoc(doc(db, "users", friend));
            if(docSnap.exists()) arr.push(docSnap.data() as User);
        }
        setOnlineFriends(arr);
    }

    useEffect(() => {
        if(onlineFriendsIDS.length >= 1) {
            syncFriendsData();
        }
    }, [onlineFriendsIDS])

    const getRandomQuestions = async (categoryID: string) => {
        const arr = Array<Question>();
        const q = query(collection(db, 'questions'), where('category', '==', categoryID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((item) => {
            arr.push(item.data() as Question);
        })
        const questions = Array<Question>();
        for(let i = 0; i < 6; i++) {
            questions.push(arr[Math.floor(Math.random() * arr.length)]);
        }
        return questions;
    }

    const handleClick = async () => {
        if(mode === 'vs' && selectedFriend) {
            // Vs mode (selected friend)
            const questions = await getRandomQuestions(category.id);
            const game = {
                id: crypto.randomUUID(),
                host: user?.uid,
                player: selectedFriend.uid,
                questions: questions,
                mode: 'vs',
                loading: true,
                category: category.id,
                answers: {host: Array<string>(), player: Array<string>()},
            } as Game
            gameContext?.setGame(game);
            webContext?.emit('game_request', game);
            router.push('/game');
        }  else if (mode == 'solo') {
            // Solo mode
            const questions = await getRandomQuestions(category.id);
            gameContext?.setGame({
                id: crypto.randomUUID(),
                host: user?.uid,
                player: null,
                questions: questions,
                mode: 'solo',
                loading: false,
                category: category.id,
                answers: {host: Array<string>(), player: Array<string>()},
            } as Game);
            router.push('/game');
        }
    }

    return (
        <Modal toggleMenu={setMenu}>
            <div className="w-full flex flex-col gap-8">
                <div className="w-full flex flex-col gap-2 justify-center items-center">
                    {category.photoURL && <img src={category.photoURL} alt={category.name} className='w-10 aspect-square' />}
                    <p style={{color: category.color}} className='font-bold tracking-widest text-sm'>{category.name}</p>
                </div>

                <div className="flex w-full gap-8 px-4">
                    <Button onClick={() => setMode('solo')} bgColor="bg-primary-300" shadowColor="shadow-primary-400" width={'w-1/2 aspect-square flex-col'}>
                        <FiUser className={`h-8 w-8 ${mode === 'solo' ? 'text-green-500' : 'text-primary-100'}`}></FiUser>
                        <p className={`text-lg ${mode === 'solo' ? 'text-green-500' : 'text-primary-100'}`}>Solo</p>
                    </Button>

                    <Button onClick={() => {
                        setMode('vs');
                        setSelectedFriend(null);
                    }} bgColor="bg-primary-300" shadowColor="shadow-primary-400" width={'w-1/2 aspect-square flex-col'}>
                        <FiUsers className={`h-8 w-8 ${mode === 'vs' ? 'text-green-500' : 'text-primary-100'}`}></FiUsers>
                        <p className={`text-lg ${mode === 'vs' ? 'text-green-500' : 'text-primary-100'}`}>vs Friend</p>
                    </Button>
                </div>

                {mode === 'vs' && <div className="flex-col w-full flex">
                    Select a friend that you want to play with
                    <div className="h-40 w-full overflow-auto flex flex-col border-2 border-primary-300">
                        {onlineFriends.length != 0 ?
                            <div className="w-full h-full overflow-auto flex flex-col">
                                {onlineFriends.map((friend) => {
                                    return (
                                        <div onClick={() => setSelectedFriend(friend)} key={friend.uid} className={`w-full p-2 hover:bg-primary-300/50 cursor-pointer text-stone-50 flex gap-4 items-center ${selectedFriend?.uid === friend.uid && 'bg-primary-300/30'}`}>
                                            {friend.photoURL && <img src={friend.photoURL} className='h-8 w-8 rounded-full' />}
                                            <p>{friend.username}</p>
                                            {selectedFriend?.uid === friend.uid && <div className="w-full h-full flex justify-end items-center px-2">
                                                <BsCheckLg className="h-5 w-5 text-green-500"></BsCheckLg>
                                            </div>}
                                        </div>
                                    )
                                })}
                            </div>
                        :
                            <div className="w-full h-full flex justify-center items-center flex-col">
                                <FaRegSadTear className="h-8 w-8"></FaRegSadTear>
                                <p>None of your friends are currently online</p>
                            </div>
                        }
                    </div>
                </div>}

                <div className="w-full flex justify-end items-center">
                    <Button onClick={handleClick} bgColor={`${mode === 'vs' ? (selectedFriend ? 'bg-green-500' : 'bg-primary-100') : 'bg-green-500'}`} shadowColor={`${mode === 'vs' ? (selectedFriend ? 'shadow-green-700' : 'shadow-primary-300') : 'shadow-green-700'}`} width={'w-auto'}>
                        <GrGamepad className="h-5 w-5 text-stone-50"></GrGamepad>
                        <p>Start game</p>
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default GameModal;