import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Layout from "../components/layout/Layout";
import { db } from "../firebase";

export default function Home() {
	const [categories, setCategories] = useState(Array<Category>());

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

	return (
		<Layout>
			<div className="w-full h-full py-4 flex flex-col gap-4">
			<p className="text-primary-100 tracking-widest uppercase font-bold text-xl">Choose quiz to start playing</p>
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
					{categories.map((category) => {
						return (
							<Button key={category.id} bgColor="bg-primary-300/70" shadowColor="shadow-primary-400" width={'w-full'}>
								<div className="w-full h-full flex flex-col items-center justify-center gap-2">
									{category.photoURL && <img src={category.photoURL} alt={category.name} className='w-full aspect-square px-4 sm:px-6 md:px-8' />}
									<p style={{color: category.color}} className='font-bold tracking-widest text-sm'>{category.name}</p>
								</div>
							</Button>
						)
					})}
				</div>
			</div>
		</Layout>
	)
}
