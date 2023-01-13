import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { MdOutlineAddCircle } from "react-icons/md";
import { useDispatch } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import DeleteCategoryModal from "../../components/admin/modal/category/DeleteCategoryModal";
import EditCategoryModal from "../../components/admin/modal/category/EditCategoryModal";
import NewCategoryModal from "../../components/admin/modal/category/NewCategoryModal";
import Button from "../../components/Button";
import { db } from "../../firebase";
import { addNotification } from "../../store/notificationsSlice";

function AdminCategoriesList() {
    const [categories, setCategories] = useState(Array<Category>());
    const [newModal, setNewModal] = useState(false);
    const [editModal, setEditModal] = useState<Category | null>(null);
    const [deleteModal, setDeleteModal] = useState<Category | null>(null);

    const dispatch = useDispatch();

    const getAllCategories = async () => {
        const arr = Array<Category>();
        const querySnapshot = await getDocs(collection(db, "categories"));
        querySnapshot.forEach((doc) => {
            arr.push(doc.data() as Category);
        })
        setCategories(arr);
    }

    const addCategory = (category: Category) => {
        setCategories([...categories, category]);
    }

    const deleteCategory = () => {
        if(deleteModal) {
            const newCategories = [...categories];
            newCategories.splice(newCategories.findIndex((element) => element.id === deleteModal.id), 1)
            setCategories(newCategories);
            deleteDoc(doc(db, "categories", deleteModal.id)).then(() => {
                dispatch(addNotification({
                    id: crypto.randomUUID(),
                    type: 'info',
                    message: `Deleted category with id ${deleteModal.id}!`
                }))
            });
            setDeleteModal(null);
        }
    }

    const editCategory = (category: Category) => {
        const arr = [...categories];
        arr[arr.findIndex(element => element.id === category.id)] = category;
        setCategories(arr);
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <AdminLayout>
            <div className="w-full h-full flex flex-col gap-16">
                <div className="w-full flex justify-between items-center">
                    <p className="text-primary-100 tracking-widest uppercase font-bold text-xl">Categories ({categories.length})</p>
                    <Button onClick={() => setNewModal(true)} bgColor="bg-green-500" shadowColor="shadow-green-700" width={'aspect-square md:w-60 md:aspect-auto'}>
                        <MdOutlineAddCircle className="h-5 w-5 text-green-700"></MdOutlineAddCircle>
                        <p className="hidden md:block">Add new category</p>
                    </Button>
                </div>

                {categories && 
                    <div className="w-full flex flex-col divide-y divide-primary-100">
                        {categories.map((category) => {
                            return (
                                <div className="w-full flex py-2 px-2 justify-between hover:bg-primary-300/50 text-stone-50 items-center gap-4" key={category.id}>
                                    <div className="flex items-center gap-4">
                                        {category.photoURL ? 
                                            <img src={category.photoURL} className="h-10 w-10"></img>
                                        :
                                            <div className="h-10 w-10"></div>
                                        }
                                        <div className="w-60">
                                            {category.name}
                                        </div>
                                    </div>
                                    <div className="w-60 truncate hidden md:block text-primary-100">
                                        {category.description}
                                    </div>
                                    <div className="w-20 justify-around flex items-center">
                                        <AiFillEdit onClick={() => setEditModal(category)} className="w-5 h-5 text-orange-300 cursor-pointer"></AiFillEdit>
                                        <AiFillDelete onClick={() => setDeleteModal(category)} className="w-5 h-5 text-red-400 cursor-pointer"></AiFillDelete>
                                    </div>
                                </div>
                            )
                        })}
                    </div>    
                }

                {/* New category modal */}
                {newModal && <NewCategoryModal addCategory={addCategory} newModal={newModal} setNewModal={setNewModal}></NewCategoryModal>}

                {/* Delete category modal */}
                {deleteModal != null && <DeleteCategoryModal deleteCategory={deleteCategory} setDeleteModal={setDeleteModal} category={deleteModal}></DeleteCategoryModal>}

                {/* Edit category modal */}
                {editModal != null && <EditCategoryModal editCategory={editCategory} setEditModal={setEditModal} category={editModal}></EditCategoryModal>}

            </div>
        </AdminLayout>
    )
}

export default AdminCategoriesList;