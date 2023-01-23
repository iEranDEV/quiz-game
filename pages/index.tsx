import { collection, getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import Layout from "../components/layout/Layout";
import GameModal from "../components/modal/GameModal";
import { GameContext } from "../context/GameContext";
import { db } from "../firebase";
import { IoGameControllerOutline } from 'react-icons/io5';

export default function Home() {
	const [categories, setCategories] = useState(Array<Category>());
	const [gameModal, setGameModal] = useState<Category | null>(null);
	const [requestsMenu, setRequestsMenu] = useState(false);

	const gameContext = useContext(GameContext);

	const getAllCategories = async () => {
        const arr = Array<Category>();
        const querySnapshot = await getDocs(collection(db, "categories"));
        querySnapshot.forEach((doc) => {
            arr.push(doc.data() as Category);
        })
        setCategories(arr);
    }

	useEffect(() => {
		getAllCategories();
	}, [])

	const acceptRequest = async (request: any) => {
		
	}

	const declineRequest = async (request: any) => {
		
	}

	return (
		<Layout>
			<div className="w-full h-full py-4 flex flex-col gap-4">
				<div className="w-full flex justify-between items-center relative">
					<p className="text-primary-100 tracking-widest uppercase font-bold text-xl">Choose quiz to start playing</p>
					<IoGameControllerOutline onClick={() => setRequestsMenu(!requestsMenu)} className="h-8 w-8 text-primary-100 cursor-pointer relative"></IoGameControllerOutline>
					{(gameContext?.requests as any).length > 0 && 
						<div className="w-3 h-3 bg-green-500 absolute top-0 right-0 rounded-full border-2 border-primary-200"></div>
					}
					{requestsMenu && <div className="w-full flex flex-col md:w-96 h-96 bg-primary-300 absolute right-0 top-full rounded-xl p-4">
						{/*requestsData.map((item) => {
							return (
								<div key={item.game.id} className='w-full flex items-center justify-between'>
									<div className="flex gap-4 items-center">
										{item.user.photoURL && <img src={item.user.photoURL} className='h-8 w-8 rounded-full' />}
										<div className="flex flex-col justify-between h-full">
											<p className="text-stone-50">{item.user.username}</p>
											<p className="text-primary-100">{item.category.name}</p>
										</div>
									</div>
									<div className="flex gap-4 items-center justify-center">
										<Button onClick={() => acceptRequest(item)} bgColor="bg-green-500" shadowColor="shadow-green-700" width={'w-auto !p-2'}>
											<TbCheck className="h-5 w-5"></TbCheck>
										</Button>
										<Button onClick={() => declineRequest(item)} bgColor="bg-red-500" shadowColor="shadow-red-700" width={'w-auto !p-2'}>
											<TbX className="h-5 w-5"></TbX>
										</Button>
									</div>
								</div>
							)
						})*/}
					</div>}
				</div>
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
					{categories.map((category) => {
						return (
							<Button onClick={() => setGameModal(category)} key={category.id} bgColor="bg-primary-300/70" shadowColor="shadow-primary-400" width={'w-full'}>
								<div className="w-full h-full flex flex-col items-center justify-center gap-2 aspect-square py-2">
									{category.photoURL && <img src={category.photoURL} alt={category.name} className='w-10 aspect-square' />}
									<p style={{color: category.color}} className='font-bold tracking-widest text-sm'>{category.name}</p>
								</div>
							</Button>
						)
					})}
				</div>

				{gameModal && <GameModal category={gameModal} setMenu={setGameModal}></GameModal>}
			</div>
		</Layout>
	)
}
