import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { TbSettings, TbUserExclamation, TbUserPlus, TbUserX } from "react-icons/tb";
import Button from "../../components/Button";
import Layout from "../../components/layout/Layout";
import { AuthContext } from "../../context/AuthContext";
import { NotificationContext } from "../../context/NotificationContext";
import { db } from "../../firebase";

function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [games, setGames] = useState(Array<GameResult>());

    const router = useRouter();

    const authContext = useContext(AuthContext);
    const notificationContext = useContext(NotificationContext);
    const currentUser = authContext.user;

    const { id } = router.query;

    useEffect(() => {
        const syncUser = async () => {
            if(id) {
                const docSnap = await getDoc(doc(db, "users", id as string));
                if(docSnap.exists()) {
                    setUser(docSnap.data() as User);
                }
            }
        }
        syncUser();
    }, [id]);

    useEffect(() => {
        if(user) {
            const getGames = async () => {
                const arr = Array<GameResult>();
                const q = query(collection(db, "users/" + user?.uid + '/games'));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => arr.push(doc.data() as GameResult));
                setGames(arr);
            }
            getGames();
        }
    }, [user]);

    const sendRequest = async (result: User) => {
        if(currentUser) {
            let resultCopy = JSON.parse(JSON.stringify(result)) as User;
            resultCopy.friendRequests.push(currentUser.uid)
            await updateDoc(doc(db, "users", resultCopy.uid), {
                friendRequests: arrayUnion(currentUser.uid),
            }).then(() => {
                notificationContext.addNotification({
                    id: crypto.randomUUID(),
                    type: 'success',
                    message: `Sent friend request to ${resultCopy.username}!`
                })
            })
        }
    }

    const cancelRequest = async (result: User) => {
        if(currentUser) {
            let resultCopy = JSON.parse(JSON.stringify(result)) as User;
            await updateDoc(doc(db, "users", result.uid), {
                friendRequests: arrayRemove(currentUser?.uid)
            }).then(() => {
                notificationContext.addNotification({
                    id: crypto.randomUUID(),
                    type: 'info',
                    message: `Canceled friend request to ${resultCopy.username}!`
                })
            })
        }
    }

    const removeFriend = async (result: User) => {
        if(currentUser) {
            let userCopy = JSON.parse(JSON.stringify(currentUser)) as User;
            userCopy.friends.splice(userCopy.friends.findIndex(element => element === result.uid), 1);
            authContext.setUser(userCopy);
            await updateDoc(doc(db, "users", currentUser.uid), {
                friends: arrayRemove(result.uid)
            })
            await updateDoc(doc(db, "users", result.uid), {
                friends: arrayRemove(currentUser.uid)
            })
            notificationContext.addNotification({
                id: crypto.randomUUID(),
                type: 'info',
                message: `Removed ${result.username} from friends!`
            })
        }
    }

    const actionButton = () => {
        if(currentUser?.uid === user?.uid) {
            // Owner profile
            return (
                <Button onClick={() => router.push('/settings/user')} bgColor='bg-primary-400/50' shadowColor="shadow-primary-400" width={'w-auto h-12'}>
                    <TbSettings className='w-5 h-5 text-orange-300'></TbSettings>
                    <p className="text-primary-100">Go to settings</p>
                </Button>
            )
        } else if(user?.uid && currentUser?.friends.includes(user?.uid)) {
            // Users are friends
            return (
                <Button onClick={() => (removeFriend(user))} bgColor='bg-primary-400/50' shadowColor="shadow-primary-400" width={'w-auto h-12'}>
                    <TbUserX className="w-5 h-5 text-red-300"></TbUserX>
                    <p className="text-primary-100">Unfriend</p>
                </Button>
            )
        } else if(user && currentUser?.uid && user.friendRequests.includes(currentUser?.uid)) {
            // User already sent friend request
            return (
                <Button onClick={() => (cancelRequest(user))} bgColor='bg-primary-400/50' shadowColor="shadow-primary-400" width={'w-auto h-12'}>
                    <TbUserExclamation className="w-5 h-5 text-orange-300"></TbUserExclamation>
                    <p className="text-primary-100">Cancel friend request</p>
                </Button>
            )
        } else if(user) {
            // Users are not friends
            return (
                <Button onClick={() => (sendRequest(user))} bgColor='bg-primary-400/50' shadowColor="shadow-primary-400" width={'w-auto h-12'}>
                    <TbUserPlus className="w-5 h-5 text-green-500"></TbUserPlus>
                    <p className="text-primary-100">Send friend request</p>
                </Button>
            )
        }
    }

    return (
        <Layout>
            <div className="w-full h-full flex flex-col gap-8 md:py-4">
                <div className="w-full flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        {user?.photoURL && <img src={user.photoURL} className='w-20 h-20 rounded-full'/>}
                        <p className="text-primary-100 text-xl font-semibold">{user?.username}</p>
                    </div>

                    {actionButton()}
                </div>
                <div className="w-full flex justify-center items-center">
                    <div className="w-full md:w-96 py-4 border-y border-primary-300 flex justify-around items-center">
                        {/* Wins */}
                        <div className="h-full p-2 flex flex-col justify-center items-center gap-2 text-green-500">
                            <h1 className="text-4xl font-bold">{games.filter(game => game.result === 'win').length}</h1>
                            <p className="font-bold">WINS</p>
                        </div>
                        {/* Draws */}
                        <div className="h-full p-2 flex flex-col justify-center items-center gap-2 text-orange-300">
                            <h1 className="text-4xl font-bold">{games.filter(game => game.result === 'draw').length}</h1>
                            <p className="font-bold">DRAWS</p>
                        </div>
                        {/* Loses */}
                        <div className="h-full p-2 flex flex-col justify-center items-center gap-2 text-red-400">
                            <h1 className="text-4xl font-bold">{games.filter(game => game.result === 'lose').length}</h1>
                            <p className="font-bold">LOSES</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ProfilePage;