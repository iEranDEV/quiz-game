import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { MdDriveFileRenameOutline, MdOutlineAddCircle, MdOutlineColorLens, MdPhotoCameraBack } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { db, storage } from "../../../../firebase";
import { addNotification } from "../../../../store/notificationsSlice";
import Button from "../../../Button";
import Modal from "../../../modal/Modal";

function NewCategoryModal({ newModal, setNewModal, addCategory }: {newModal: boolean, setNewModal: Function, addCategory: Function}) {
    const [color, setColor] = useState('#778da9');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('')

    const colorRef = useRef(null);
    const photoRef = useRef(null);
    const dispatch = useDispatch();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const category: Category = {
            id: crypto.randomUUID(),
            name: name,
            description: description, 
            color: color,
            photoURL: null
        }

        // Handle photo
        if((photoRef.current as any).files.length >= 1) {
            const avatarRef = ref(storage, 'category_images/' + category.id);
            const url = await uploadBytes(avatarRef, (photoRef.current as any).files[0]).then(async (snapshot) => {
                return getDownloadURL(snapshot.ref).then((url) => {
                    return url;
                })
            });
            console.log(url);
            category.photoURL = url;
        }

        // Add category to DB
        await setDoc(doc(db, "categories", category.id), category).then(() => {
            setNewModal(false);
            addCategory(category);
            // Add notification
            dispatch(addNotification({
                id: crypto.randomUUID(),
                type: 'success',
                message: `Added new category with id ${category.id}!`
            }))
        }).catch((error) => {
            setNewModal(false);
            // Ad notification
            dispatch(addNotification({
                id: crypto.randomUUID(),
                type: 'error',
                message: `An error occured!`
            }))
        });
    }

    return (
        <Modal toggleMenu={() => setNewModal(!newModal)}>
            <form onSubmit={(e) => handleSubmit(e)} className="w-full h-full flex flex-col gap-8">

                {/* Category name */}
                <div className="flex flex-col gap-2 max-w-sm">
                    <label htmlFor="name" className="uppercase text-primary-100 flex gap-2">
                        <MdDriveFileRenameOutline className="h-5 w-5 text-orange-300"></MdDriveFileRenameOutline>
                        <p className="text-orange-300 uppercase tracking-widest font-bold text-sm">Name</p>
                    </label>
                    <input type="text" name="name" id="name" className="form-control" placeholder="E.g. Science" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                {/* Category description */}
                <div className="flex flex-col gap-2 max-w-sm">
                    <label htmlFor="description" className="uppercase text-primary-100 flex gap-2">
                        <TbFileDescription className="h-5 w-5 text-orange-300"></TbFileDescription>
                        <p className="text-orange-300 uppercase tracking-widest font-bold text-sm">Description</p>
                    </label>
                    <textarea name="description" id="description" cols={30} rows={3} className="form-control border-2 rounded-xl p-1" placeholder="Some funny description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>

                {/* Category image */}
                <div onClick={() => (photoRef.current as any).click()} className="flex flex-col justify-center items-center gap-2 p-4 rounded-xl w-full border-dashed cursor-pointer border-2 border-orange-300 text-orange-300 hover:border-orange-400 hover:text-orange-400">
                    <MdPhotoCameraBack className="h-6 w-6"></MdPhotoCameraBack>
                    <p>Click to select image</p>
                </div>

                <input type="file" name="photo" id="photo" ref={photoRef} className='hidden' />

                <div className="w-full flex items-center justify-between">
                    <div className="flex w-full">
                        <button type="button" style={{ backgroundColor: color }} onClick={() => (colorRef.current as any).click()} className='text-stone-50 py-2 px-4 shadow rounded-xl hover:shadow-none flex justify-center items-center gap-4 hover:translate-y-[5px] transition-all shadow-primary-300 w-auto'>
                            <MdOutlineColorLens className="h-5 w-5 text-primary-400"></MdOutlineColorLens>
                            <p className="text-primary-400">Pick color</p>
                        </button>

                        <input type="color" name="color" id="color" className="w-0 opacity-0" ref={colorRef} value={color} onChange={(e) => setColor(e.target.value)} />
                    </div>

                    <Button onClick={() => setNewModal(true)} bgColor="bg-green-500" shadowColor="shadow-green-700" width={'w-auto'}>
                        <MdOutlineAddCircle className="h-5 w-5 text-green-700"></MdOutlineAddCircle>
                        <p>Create</p>
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default NewCategoryModal;