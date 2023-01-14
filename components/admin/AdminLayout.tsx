import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { auth, db } from '../../firebase';
import { RootState } from '../../store/store';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import AdminNavBar from './AdminNavBar';
import NotificationElement from '../NotificationElement';
import { AuthContext } from '../../context/AuthContext';

function AdminLayout({ children }: {children: JSX.Element | Array<JSX.Element>}) {
    const [menu, setMenu] = useState(false);
    const authContext = useContext(AuthContext);
    const router = useRouter();

    const user = authContext.user;
    const loading = authContext.loading;
    const notifications = useSelector((state: RootState) => state.notifications.notifications);

    useEffect(() => {
        if(user?.role !== 'ADMIN') {
            router.push('/');
        }
    }, [user])

    const authorized = () => {
        if(user) {
            if(user.role === 'ADMIN') return true;
        }
        return false;
    }

    return (
        <>
            {authorized() && <div className="w-screen h-screen bg-primary-200 flex flex-col md:flex-row text-primary-100">
                <AdminNavBar menu={menu} setMenu={setMenu}></AdminNavBar>
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