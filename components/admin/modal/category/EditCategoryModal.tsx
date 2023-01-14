import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useRef, useState } from "react";
import { MdDriveFileRenameOutline, MdOutlineColorLens, MdOutlineUpdate, MdPhotoCameraBack } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { NotificationContext } from "../../../../context/NotificationContext";
import { db, storage } from "../../../../firebase";
import Button from "../../../Button";
import Modal from "../../../modal/Modal";

function EditCategoryModal({ category, setEditModal, editCategory }: {category: Category, setEditModal: Function, editCategory: Function}) {
    const [color, setColor] = useState(category.color);
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);

    const colorRef = useRef(null);
    const photoRef = useRef(null);
    const notificationContext = useContext(NotificationContext);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newCategory: Category = {
            id: category.id,
            name: name,
            description: description, 
            color: color,
            photoURL: category.photoURL,
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
            newCategory.photoURL = url;
        }

        await updateDoc(doc(db, "categories", category.id), {
            name: name,
            description: description, 
            color: color,
            photoURL: newCategory.photoURL
        }).then(() => {
            editCategory(newCategory);
            notificationContext.addNotification({
                id: crypto.randomUUID(),
                type: 'success',
                message: `Successfully updated category!`
            })
            setEditModal(null);
        })
    }

    return (
        <Modal toggleMenu={() => setEditModal(null)}>
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

                    <Button bgColor="bg-green-500" shadowColor="shadow-green-700" width={'w-auto'}>
                        <MdOutlineUpdate className="h-5 w-5 text-green-700"></MdOutlineUpdate>
                        <p>Update</p>
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default EditCategoryModal;