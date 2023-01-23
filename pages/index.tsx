import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import Layout from "../components/layout/Layout";
import GameModal from "../components/modal/GameModal";
import { db } from "../firebase";
import { IoGameControllerOutline } from 'react-icons/io5';
import { AuthContext } from "../context/AuthContext";
import { TbCheck, TbX } from "react-icons/tb";
import { useRouter } from "next/router";

export default function Home() {
	const [categories, setCategories] = useState(Array<Category>());
	const [gameModal, setGameModal] = useState<Category | null>(null);
	const [requestsMenu, setRequestsMenu] = useState(false);
	const [requests, setRequests] = useState(Array<{sender: User | null, request: GameRequest}>());

	const router = useRouter();
	const authContext = useContext(AuthContext);
	const user = authContext.user;

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

	useEffect(() => {
		if(user) {
			const q = query(collection(db, "gameRequests"), where("receiver", "==", user?.uid))
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const arr = Array<{sender: User, request: GameRequest}>();
				snapshot.forEach(async (val) => {
					const data = val.data() as GameRequest;
					const endTime: Date = (data.endTime as any).toDate();
					if(new Date() < endTime) {
						const senderSnapshot = await getDoc(doc(db, "users", data.sender));
						if(senderSnapshot.exists()) {
							arr.push({
								sender: senderSnapshot.data() as User,
								request: data,
							})
						}
					}
				})
				setRequests(arr);
			})

			return () => {
				unsubscribe();
			}
		}
	}, [user?.uid]);

	const acceptRequest = async (request: GameRequest) => {
		const gameSnap = await getDoc(doc(db, "games", request.id));
		if(gameSnap.exists()) {
			await updateDoc(doc(db, "games", request.id), {
				status: 'quiz',
			})
		}
		router.push('/game/' + request.id);
		await deleteDoc(doc(db, "gameRequests", request.id));
	}

	const declineRequest = async (request: GameRequest) => {
		const gameSnap = await getDoc(doc(db, "games", request.id));
		if(gameSnap.exists()) {
			await updateDoc(doc(db, "games", request.id), {
				status: "canceled"
			})
		}
		await deleteDoc(doc(db, "gameRequests", request.id));
	}

	return (
		<Layout>
			<div className="w-full h-full py-4 flex flex-col gap-4">
				<div className="w-full flex justify-between items-center relative">
					<p className="text-primary-100 tracking-widest uppercase font-bold text-xl">Choose quiz to start playing</p>
					<IoGameControllerOutline onClick={() => setRequestsMenu(!requestsMenu)} className="h-8 w-8 text-primary-100 cursor-pointer relative"></IoGameControllerOutline>
					{requests.length > 0 && 
						<div className="w-3 h-3 bg-green-500 absolute top-0 right-0 rounded-full border-2 border-primary-200"></div>
					}
					{requestsMenu && <div className="w-full flex flex-col gap-2 md:w-96 h-96 bg-primary-300 absolute right-0 top-full rounded-xl p-4">
						{requests.map((item) => {
							return (
								<div key={item.request.id} className='w-full flex items-center justify-between'>
									<div className="flex gap-4 items-center">
										{item.sender?.photoURL && <img src={item.sender?.photoURL} className='h-8 w-8 rounded-full' />}
										<div className="flex flex-col justify-between h-full">
											<p className="text-stone-50">{item.sender?.username}</p>
											<p className="text-primary-100">{item.request.categoryName}</p>
										</div>
									</div>
									<div className="flex gap-4 items-center justify-center">
										<Button onClick={() => acceptRequest(item.request)} bgColor="bg-green-500" shadowColor="shadow-green-700" width={'w-auto !p-2'}>
											<TbCheck className="h-5 w-5"></TbCheck>
										</Button>
										<Button onClick={() => declineRequest(item.request)} bgColor="bg-red-500" shadowColor="shadow-red-700" width={'w-auto !p-2'}>
											<TbX className="h-5 w-5"></TbX>
										</Button>
									</div>
								</div>
							)
						})}
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
