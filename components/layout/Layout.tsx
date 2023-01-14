import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, db } from '../../firebase';
import { RootState } from '../../store/store';
import { setLoading, setUser } from '../../store/userSlice';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import NavBar from '../NavBar';
import NotificationElement from '../NotificationElement';
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { AuthContext } from '../../context/AuthContext';
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

function Layout({ children }: {children: JSX.Element | Array<JSX.Element>}) {
    const [menu, setMenu] = useState(false);

    const authContext = useContext(AuthContext);

    const user = authContext.user;
    const loading = authContext.loading
    const notifications = useSelector((state: RootState) => state.notifications.notifications);

    /*useEffect(() => {
        if(user) {
            const socketInitializer = async () => {
                console.log(user?.uid);
                await fetch('/api/socket?uid=' + user?.uid);
                socket = io();
    
                socket.on('connect', () => {
                    console.log('client - connected')
                })

                socket.on('friends-activity', () => {
                    
                })

            }
            socketInitializer();
        }
    }, [user]);*/

    return (
        <div className="w-screen h-screen bg-primary-200 flex flex-col md:flex-row text-primary-100">
            <NavBar menu={menu} setMenu={setMenu}></NavBar>
            <div className="w-full text-stone-50">
                {loading ? 
                    <div className='w-full h-full flex justify-center items-center'>
                        <AiOutlineLoading3Quarters className='w-10 h-10 text-primary-100 animate-spin'></AiOutlineLoading3Quarters>
                    </div> 
                : 
                    <div className='w-full h-full'>
                        {user ?
                            <div className='w-full h-full px-4'>{children}</div>
                        :
                            <div></div>
                        }
                    </div>       
                }
            </div>
            <div className='w-full md:w-96 fixed right-0 bottom-0 flex flex-col-reverse p-2 gap-2'>
                {notifications.map(notification => {
                    return <NotificationElement id={notification.id} key={notification.id} type={notification.type} message={notification.message}></NotificationElement>
                })}
            </div>
        </div>
    )
}

export default Layout;