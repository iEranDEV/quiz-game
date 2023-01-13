import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { MdOutlineAddCircle, MdPhotoCameraBack } from "react-icons/md";
import { useDispatch } from "react-redux";
import { db, storage } from "../../../../firebase";
import { addNotification } from "../../../../store/notificationsSlice";
import Button from "../../../Button";
import { BsFillPatchQuestionFill } from 'react-icons/bs'
import Modal from "../../../modal/Modal";
import { AiOutlineCheck } from "react-icons/ai";
import SelectList from "../../../SelectList";

function NewCategoryModal({ newModal, setNewModal, addQuestion, categories }: {newModal: boolean, setNewModal: Function, addQuestion: Function, categories: Array<Category>}) {
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [category, setCategory] = useState(categories[0].id);
    const [correctAnswer, setCorrectAnswer] = useState(0);

    const mediaRef = useRef(null);
    const dispatch = useDispatch();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const answersVal = Array<Answer>();
        let correctVal = '';
        answers.forEach((val, index) => {
            const answer = { id: crypto.randomUUID(), content: val}
            answersVal.push(answer);
            if(index === correctAnswer) correctVal = answer.id;
        })
        if(correctVal === '') correctVal = answersVal[0].id;

        const questionObj: Question = {
            id: crypto.randomUUID(),
            question: question,
            answers: answersVal,
            mediaURL: null,
            category: category,
            correctAnswer: correctVal
        }

        // Handle photo
        if((mediaRef.current as any).files.length >= 1) {
            const avatarRef = ref(storage, 'questions_media/' + questionObj.id);
            const url = await uploadBytes(avatarRef, (mediaRef.current as any).files[0]).then(async (snapshot) => {
                return getDownloadURL(snapshot.ref).then((url) => {
                    return url;
                })
            });
            questionObj.mediaURL = url;
        }

        // Add category to DB
        await setDoc(doc(db, "questions", questionObj.id), questionObj).then(() => {
            setNewModal(false);
            addQuestion(questionObj);
            // Add notification
            dispatch(addNotification({
                id: crypto.randomUUID(),
                type: 'success',
                message: `Added new question with id ${questionObj.id}!`
            }))
        }).catch(() => {
            setNewModal(false);
            // Ad notification
            dispatch(addNotification({
                id: crypto.randomUUID(),
                type: 'error',
                message: `An error occured!`
            }))
        });
    }

    const changeAnswer = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    }

    const formatArray = (arr: Array<Category>) => {
        const toReturn = Array<{ value: string, name: string}>()
        arr.forEach((item) => {
            toReturn.push({
                value: item.id,
                name: item.name
            })
        })
        return toReturn;
    }

    return (
        <Modal toggleMenu={() => setNewModal(!newModal)}>
            <form onSubmit={(e) => handleSubmit(e)} className="w-full h-full flex flex-col gap-8">

                {/* Question */}
                <div className="flex flex-col gap-2 max-w-sm">
                    <label htmlFor="name" className="uppercase text-primary-100 flex gap-2">
                        <BsFillPatchQuestionFill className="h-5 w-5 text-orange-300"></BsFillPatchQuestionFill>
                        <p className="text-orange-300 uppercase tracking-widest font-bold text-sm">Question</p>
                    </label>
                    <input type="text" name="name" id="name" className="form-control" placeholder="..." value={question} onChange={(e) => setQuestion(e.target.value)} />
                </div>

                {/* Answers */}
                <div className="w-full flex flex-col gap-2">
                    {Array.from(Array(4), (e, i) => {
                        return (
                            <div className="w-full flex gap-2 items-center" key={i}>
                                <div onClick={() => setCorrectAnswer(i)} className={`w-8 cursor-pointer aspect-square h-8 rounded-xl flex justify-center items-center text-stone-50 ${correctAnswer === i ? 'bg-green-500' : 'bg-primary-100'}`}>
                                    {correctAnswer === i && <AiOutlineCheck className="h-5 w-5"></AiOutlineCheck>}
                                </div>
                                <input value={answers[i]} onChange={(e) => changeAnswer(i, e.target.value)} type="text" className='w-full border border-primary-300 bg-primary-200 rounded-xl text-stone-50 p-2 placeholder-primary-100' placeholder={`Answer #${i}`} />
                            </div>
                        )
                    })}
                </div>

                {/* Category select */}
                <div className="w-full flex flex-col gap-2 relative">
                    <SelectList values={formatArray([...categories])} onChange={(val: string) => setCategory(val)}></SelectList>
                </div>

                {/* Question image */}
                <div onClick={() => (mediaRef.current as any).click()} className="flex flex-col justify-center items-center gap-2 p-4 rounded-xl w-full border-dashed cursor-pointer border-2 border-orange-300 text-orange-300 hover:border-orange-400 hover:text-orange-400">
                    <MdPhotoCameraBack className="h-6 w-6"></MdPhotoCameraBack>
                    <p>Click to select image</p>
                </div>

                <input type="file" name="photo" id="photo" ref={mediaRef} className='hidden' />

                <div className="w-full flex items-center justify-end">

                    <Button bgColor="bg-green-500" shadowColor="shadow-green-700" width={'w-auto'}>
                        <MdOutlineAddCircle className="h-5 w-5 text-green-700"></MdOutlineAddCircle>
                        <p>Create</p>
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default NewCategoryModal;