import { useEffect } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { removeNotification } from "../store/notificationsSlice";


function Notification({ id, type, message }: INotification) {

    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => {
            dispatch(removeNotification(id))
        }, 3000)
    }, [])

    const style = (type === 'success' ? 'bg-green-500 border-green-600 text-stone-50' : (type === 'info') ? 'bg-red-300 border-red-400' : 'bg-orange-300 border-orange-400')

    return (
        <div className={`w-full ${style} border-2 rounded-xl px-4 py-2 flex gap-4 items-center animate-slideIn text-sm`}>
            <AiOutlineExclamationCircle className="h-6 w-6"></AiOutlineExclamationCircle>
            {message}
        </div>
    )
}

export default Notification;