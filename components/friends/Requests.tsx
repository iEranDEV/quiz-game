import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { TbCheck, TbMoodEmpty, TbX } from "react-icons/tb";
import { AuthContext } from "../../context/AuthContext";
import { NotificationContext } from "../../context/NotificationContext";
import { db } from "../../firebase";
import Button from "../Button";

function Requests({ setMenu }: { setMenu: Function }) {
    const [requests, setRequests] = useState(Array<User>());

    const notificationContext = useContext(NotificationContext);
    const authContext = useContext(AuthContext);
    const user = authContext.user;

    const syncData = async () => {
        if(user) {
            let arr = Array<User>();
            for (const friend of user.friendRequests) {
                const friendSnap = await getDoc(doc(db, "users", friend));
                if(friendSnap.exists()) arr.push(friendSnap.data() as User);
            }
            setRequests(arr);
        }
    }
    
    useEffect(() => {
        syncData();
    }, []);

    const acceptRequest = async (request: User) => {
        await updateDoc(doc(db, "users", user?.uid as string), {
            friendRequests: arrayRemove(request.uid),
            friends: arrayUnion(request.uid),
        })
        await updateDoc(doc(db, "users", request.uid), {
            friends: arrayUnion(user?.uid),
        })
        syncData();
        notificationContext.addNotification({
            id: crypto.randomUUID(),
            type: 'success',
            message: `${request.username} is now your friend!`
        })
        setMenu(false);
    }

    const declineRequest = async (request: User) => {
        if(user) {
            await updateDoc(doc(db, "users", user.uid), {
                friendRequests: arrayRemove(request.uid)
            })
            syncData();
            setMenu(false);
        }
    }

    const friendsNotification = (user && user.friendRequests.length >= 1 ? true : false);

    return (
        <div className="w-full md:w-96 h-96 bg-primary-300 absolute right-0 top-full rounded-xl p-4">
            {friendsNotification ? 
                <div className="w-full h-full flex flex-col gap-2 divide-y divide-primary-100">
                    {requests.map((request) => {
                        return (
                            <div className="w-full py-1 flex justify-between items-center" key={request.uid}>
                                <p>{request.username}</p>
                                <div className="flex gap-4 items-center justify-center">
                                    <Button onClick={() => acceptRequest(request)} bgColor="bg-green-500" shadowColor="shadow-green-700" width={'w-auto !p-2'}>
                                        <TbCheck className="h-5 w-5"></TbCheck>
                                    </Button>
                                    <Button onClick={() => declineRequest(request)} bgColor="bg-red-500" shadowColor="shadow-red-700" width={'w-auto !p-2'}>
                                        <TbX className="h-5 w-5"></TbX>
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            :
                <div className="w-full h-full flex justify-center items-center flex-col gap-4 text-primary-100">
                    <TbMoodEmpty className="w-8 h-8"></TbMoodEmpty>
                    <p>You dont have any friend requests</p>
                </div>
            }
        </div>
    )
}

export default Requests;