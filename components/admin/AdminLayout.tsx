import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, db } from '../../firebase';
import { RootState } from '../../store/store';
import { setLoading, setUser } from '../../store/userSlice';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import AdminNavBar from './AdminNavBar';
import NotificationElement from '../NotificationElement';

function AdminLayout({ children }: {children: JSX.Element | Array<JSX.Element>}) {
    const [menu, setMenu] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user.user);
    const loading = useSelector((state: RootState) => state.user.loading);
    const notifications = useSelector((state: RootState) => state.notifications.notifications);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (data) => {
            console.log(data)
            if(data) {
                dispatch(setLoading(true));
                const userSnap = await getDoc(doc(db, "users", data.uid));
                if(userSnap.exists()) {
                    if((userSnap.data() as User).role !== 'ADMIN') {
                        router.push('/');
                        dispatch(setLoading(false));
                        dispatch(setUser(null));
                    } else {
                        dispatch(setUser(userSnap.data() as User));
                        dispatch(setLoading(false));
                    }
                } else {
                    router.push('/accounts/login');
                    dispatch(setLoading(false));
                    dispatch(setUser(null));
                }
            } else {
                dispatch(setUser(null));
                router.push('/accounts/login');
            }
        })
        return unsubscribe;
    }, [])

    const authorized = () => {
        if(user) {
            if(user.role === 'ADMIN') return true;
        }
        return false;
    }

    return (
        <>
            {authorized() && <div className="w-screen h-screen bg-primary-200 flex flex-col md:flex-row text-primary-100">
                <AdminNavBar menu={menu} setMenu={setMenu} user={user}></AdminNavBar>
                <div className="w-full text-stone-50">
                    {loading ? 
                        <div className='w-full h-full flex justify-center items-center'>
                            <AiOutlineLoading3Quarters className='w-10 h-10 text-primary-100 animate-spin'></AiOutlineLoading3Quarters>
                        </div> : 
                        <div className='w-full h-full px-4 md:py-4'>
                            {children}
                        </div>
                    }
                </div>
                <div className='w-full md:w-96 fixed right-0 bottom-0 flex flex-col-reverse p-2 gap-2'>
                    {notifications.map(notification => {
                        return <NotificationElement id={notification.id} key={notification.id} type={notification.type} message={notification.message}></NotificationElement>
                    })}
                </div>
            </div>}
        </>
    )
}

export default AdminLayout;