import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import Button from "../../../Button";
import Modal from "../../../modal/Modal";

function DeleteQuestionModal({ deleteQuestion, setDeleteModal, question }: { deleteQuestion: Function, setDeleteModal: Function, question: Question }) {


    return (
        <Modal toggleMenu={() => setDeleteModal(null)}>

            <div className="w-full flex flex-col gap-4">
                <div>
                    <p className="text-primary-100 tracking-widest uppercase font-bold text-xl">Confirm?</p>
                    <p>Confirm removal of question <span className="text-orange-300">{question.question}</span></p>
                </div>
                <div className="flex items-center justify-between">
                    <Button onClick={() => setDeleteModal(null)} bgColor="bg-green-500" shadowColor="shadow-green-700" width={'w-auto'}>
                        <AiOutlineClose className='h-5 w-5'></AiOutlineClose>
                        <p>Cancel</p>
                    </Button>
                    <Button onClick={() => deleteQuestion()} bgColor="bg-red-500" shadowColor="shadow-red-700" width={'w-auto'}>
                        <AiFillDelete className="h-5 w-5"></AiFillDelete>
                        <p>Delete</p>
                    </Button>
                </div>
            </div>

        </Modal>
    )
}

export default DeleteQuestionModal;