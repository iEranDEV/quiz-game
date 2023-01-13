import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { MdOutlineAddCircle } from "react-icons/md";
import { useDispatch } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import DeleteQuestionModal from "../../components/admin/modal/question/DeleteQuestionModal";
import EditQuestionModal from "../../components/admin/modal/question/EditQuestionModal";
import NewQuestionModal from "../../components/admin/modal/question/NewQuestionModal";
import Button from "../../components/Button";
import SelectList from "../../components/SelectList";
import { db } from "../../firebase";
import { addNotification } from "../../store/notificationsSlice";

function AdminQuestionsList() {
    const [questions, setQuestions] = useState(Array<Question>());
    const [categories, setCategories] = useState(Array<Category>());
    const [newModal, setNewModal] = useState(false);
    const [editModal, setEditModal] = useState<Question | null>(null);
    const [deleteModal, setDeleteModal] = useState<Question | null>(null);
    const [searchQuery, setSearchQuery] = useState('all');

    const dispatch = useDispatch();

    const getAllCategories = async () => {
        const arr = Array<Category>();
        const querySnapshot = await getDocs(collection(db, "categories"));
        querySnapshot.forEach((doc) => {
            arr.push(doc.data() as Category);
        })
        setCategories(arr);
    }

    const getAllQuestions = async () => {
        const arr = Array<Question>();
        const querySnapshot = await getDocs(collection(db, "questions"));
        querySnapshot.forEach((doc) => {
            arr.push(doc.data() as Question);
        })
        setQuestions(arr);
    }

    const addQuestion = (question: Question) => {
        setQuestions([...questions, question]);
    }

    const deleteQuestion = () => {
        if(deleteModal) {
            const newQuestions = [...questions];
            newQuestions.splice(newQuestions.findIndex((element) => element.id === deleteModal.id), 1)
            setQuestions(newQuestions);
            deleteDoc(doc(db, "questions", deleteModal.id)).then(() => {
                dispatch(addNotification({
                    id: crypto.randomUUID(),
                    type: 'info',
                    message: `Deleted question with id ${deleteModal.id}!`
                }))
            });
            setDeleteModal(null);
        }
    }

    const editQuestion = (question: Question) => {
        const arr = [...questions];
        arr[arr.findIndex(element => element.id === question.id)] = question;
        setQuestions(arr);
    }

    const structure = () => {
        if(searchQuery === 'all') {
            return [...questions];
        } else {
            return [...questions].filter(element => element.category === searchQuery);
        }
    }

    useEffect(() => {
        getAllCategories();
        getAllQuestions();
    }, []);

    const searchArray = () => {
        const arr = Array<{value: string, name: string}>();
        arr.push({value: 'all', name: 'All categories'});
        categories.forEach((item) => arr.push({value: item.id, name: item.name}));
        return arr;
    }

    return (
        <AdminLayout>
            <div className="w-full h-full flex flex-col gap-8">
                <div className="w-full flex justify-between items-center">
                    <p className="text-primary-100 tracking-widest uppercase font-bold text-xl">Questions ({questions.length})</p>
                    <Button onClick={() => setNewModal(true)} bgColor="bg-green-500" shadowColor="shadow-green-700" width={'aspect-square md:w-60 md:aspect-auto'}>
                        <MdOutlineAddCircle className="h-5 w-5 text-green-700"></MdOutlineAddCircle>
                        <p className="hidden md:block">Add new question</p>
                    </Button>
                </div>

                <div className="w-full flex gap-4 items-center">
                    <p className="text-orange-300 uppercase font-bold text-sm">Filter by</p>
                    <div className="w-60">
                        <SelectList values={searchArray()} onChange={(val: string) => setSearchQuery(val)}></SelectList>
                    </div>
                </div>

                {questions && 
                    <div className="w-full flex flex-col divide-y divide-primary-100">
                        <div className="w-full flex py-2 px-2 justify-between hover:bg-primary-300/50 text-stone-50 items-center gap-4">
                            <div className="w-60 truncate text-orange-300 uppercase font-bold text-sm">Name</div>
                            <div className="w-60 text-orange-300 uppercase font-bold text-sm">Category</div>
                            <div className="w-20"></div>
                        </div>
                        {structure().map((question) => {
                            return (
                                <div className="w-full flex py-2 px-2 justify-between hover:bg-primary-300/50 text-stone-50 items-center gap-4" key={question.id}>
                                    <div className="w-60 truncate">
                                        {question.question}
                                    </div>
                                    <div className="w-60 text-primary-100">
                                        {categories.find(element => element.id === question.category)?.name}
                                    </div>
                                    <div className="w-20 justify-around flex items-center">
                                        <AiFillEdit onClick={() => setEditModal(question)} className="w-5 h-5 text-orange-300 cursor-pointer"></AiFillEdit>
                                        <AiFillDelete onClick={() => setDeleteModal(question)} className="w-5 h-5 text-red-400 cursor-pointer"></AiFillDelete>
                                    </div>
                                </div>
                            )
                        })}
                    </div>    
                }

                {/* New category modal */}
                {newModal && <NewQuestionModal addQuestion={addQuestion} categories={categories} newModal={newModal} setNewModal={setNewModal}></NewQuestionModal>}
                
                {/* Delete category modal */}
                {deleteModal != null && <DeleteQuestionModal deleteQuestion={deleteQuestion} setDeleteModal={setDeleteModal} question={deleteModal}></DeleteQuestionModal>}

                {/* Edit category modal */}
                {editModal != null && <EditQuestionModal questionObject={editModal} editQuestion={editQuestion} setEditModal={setEditModal} categories={categories}></EditQuestionModal>}
                
            </div>
        </AdminLayout>
    )
}

export default AdminQuestionsList;