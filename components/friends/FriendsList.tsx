import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { TbMoodCry, TbUserExclamation, TbUserPlus, TbUserX } from "react-icons/tb";
import { AuthContext } from "../../context/AuthContext";
import { NotificationContext } from "../../context/NotificationContext";
import { WebContext } from "../../context/WebContext";
import { db } from "../../firebase";

function FriendsList({ searchQuery }: { searchQuery: string | null }) {
    const [results, setResults] = useState(Array<User>());
    const [onlineFriends, setOnlineFriends] = useState(Array<string>());

    const notificationContext = useContext(NotificationContext);
    const authContext = useContext(AuthContext);
    const webContext = useContext(WebContext);
    const user = authContext.user;

    useEffect(() => {
        webContext?.emit('get_friends_activity', user?.friends, (response: any) => {
            setOnlineFriends(response);
        });
    }, []);

    const syncData = async () => {
        if(user) {
            const arr = Array<User>();
            if(searchQuery) {
                const q = query(collection(db, "users"), where('username', '>=', searchQuery), where('username', '<=', searchQuery + 'z'));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const data = doc.data() as User;
                    if(data.uid !== user.uid) {
                        arr.push(data)
                    }
                });
            } else {
                for(const friend of user.friends) {
                    const docSnap = await getDoc(doc(db, "users", friend));
                    if(docSnap.exists()) arr.push(docSnap.data() as User);
                }
            }
            setResults(arr);
        }
    }

    useEffect(() => {
        if(!user) return;
        syncData();
    }, [searchQuery])

    const sendRequest = async (result: User) => {
        if(user) {
            let resultCopy = JSON.parse(JSON.stringify(result)) as User;
            resultCopy.friendRequests.push(user.uid)
            await updateDoc(doc(db, "users", resultCopy.uid), {
                friendRequests: arrayUnion(user.uid),
            }).then(() => {
                syncData();
                notificationContext.addNotification({
                    id: crypto.randomUUID(),
                    type: 'success',
                    message: `Sent friend request to ${resultCopy.username}!`
                })
            })
        }
    }

    const cancelRequest = async (result: User) => {
        if(user) {
            let resultCopy = JSON.parse(JSON.stringify(result)) as User;
            await updateDoc(doc(db, "users", result.uid), {
                friendRequests: arrayRemove(user.uid)
            }).then(() => {
                syncData();
                notificationContext.addNotification({
                    id: crypto.randomUUID(),
                    type: 'info',
                    message: `Canceled friend request to ${resultCopy.username}!`
                })
            })
        }
    }

    const removeFriend = async (result: User) => {
        if(user) {
            let userCopy = JSON.parse(JSON.stringify(user)) as User;
            userCopy.friends.splice(userCopy.friends.findIndex(element => element === result.uid), 1);
            authContext.setUser(userCopy);
            await updateDoc(doc(db, "users", user.uid), {
                friends: arrayRemove(result.uid)
            })
            await updateDoc(doc(db, "users", result.uid), {
                friends: arrayRemove(user.uid)
            })
            syncData();
            notificationContext.addNotification({
                id: crypto.randomUUID(),
                type: 'info',
                message: `Removed ${result.username} from friends!`
            })
        }
    }

    const renderIcon = (result: User) => {
        if(user) {
            if(user.friends.includes(result.uid)) {
                // Users are friends
                return <TbUserX onClick={() => removeFriend(result)} className="text-red-300 h-5 w-5 hover:text-red-400 cursor-pointer"></TbUserX>
            } else if(result.friendRequests.includes(user.uid)) {
                // User already sent friend request
                return <TbUserExclamation onClick={() => cancelRequest(result)} className="text-orange-300 h-5 w-5 hover:text-orange-400 cursor-pointer"></TbUserExclamation>
            } else {
                // User didn't send friend request
                return <TbUserPlus onClick={() => sendRequest(result)} className="text-green-300 h-5 w-5 hover:text-green-400 cursor-pointer"></TbUserPlus>
            }
        }
    }

    return (
        <div className="w-full h-full">
            {results.length >= 1 ?
                <div className="w-full md:w-96 flex flex-col gap-2 divide-y divide-primary-100">
                    {results.map((result) => {
                        return (
                            <div key={result.uid} className="flex justify-between items-center py-2">
                                <div className="flex gap-4 w-full items-center relative">
                                    <img src={result.photoURL as string} alt={result.username} className='rounded-full h-7 w-7' />
                                    <p>{result.username}</p>
                                    {onlineFriends.includes(result.uid) && <div className="w-3 h-3 bg-green-500 rounded-full absolute -top-1 -left-1 border-2 border-primary-200"></div>}
                                </div>
                                {renderIcon(result)}
                            </div>
                        )
                    })}
                </div>
            :
                <div className="w-full h-full flex flex-col gap-4 justify-center items-center text-primary-100">
                    <TbMoodCry className="w-8 h-8"></TbMoodCry>
                    <p>No results</p>
                </div>
            }
        </div>
    )
}

export default FriendsList;