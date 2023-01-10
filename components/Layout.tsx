import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HiXMark, HiBars3 } from 'react-icons/hi2'
import { TbHome, TbUsers, TbUser, TbSettings, TbBell } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux';
import { auth, db } from '../firebase';
import { RootState } from '../store/store';
import { setLoading, setUser } from '../store/userSlice';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function Layout({ children }: {children: JSX.Element | Array<JSX.Element>}) {
    const [menu, setMenu] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user.user);
    const loading = useSelector((state: RootState) => state.user.loading);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (data) => {
            console.log(data);
            if(data) {
                dispatch(setLoading(true));
                const userSnap = await getDoc(doc(db, "users", data.uid));
                if(userSnap.exists()) {
                    dispatch(setUser(userSnap.data() as User));
                    dispatch(setLoading(false));
                } else {
                    router.push('/accounts/login');
                    dispatch(setLoading(false));
                    dispatch(setUser(null));
                }
            } else {
                dispatch(setUser(null));
            }
        })
        return unsubscribe;
    }, [])

    return (
        <div className="w-screen h-screen bg-primary-200 flex flex-col md:flex-row text-primary-100">
            <div className="flex w-full md:w-auto items-center p-4 md:p-0">
                <HiBars3 onClick={() => setMenu(!menu)} className='w-8 h-8 md:hidden'></HiBars3>

                <div className={`fixed w-screen md:w-60 h-screen top-0 left-0 flex flex-col bg-primary-300 gap-16 md:gap-0 justify-center md:justify-around items-center transition-all md:static ${menu ? 'left-0' : '-left-full'}`}>
                    <div className='flex w-full items-center p-4 absolute top-0 left-0'>
                        <HiXMark onClick={() => setMenu(!menu)} className='w-8 h-8 md:hidden'></HiXMark>
                    </div>

                    <p style={{fontFamily: 'Bouncy'}} className='text-3xl text-orange-300'>quizly</p>

                    <div className='flex flex-col w-full justify-center items-center'>
                        <div className={`navLink ${router.pathname === '/' && 'bg-primary-400/30 md:border-r-4 md:border-orange-300'}`}>
                            <TbHome className='w-5 h-5 text-orange-300'></TbHome>
                            Home
                        </div>
                        <div className='navLink'>
                            <TbUsers className='w-5 h-5 text-orange-300'></TbUsers>
                            Friends
                            {/*<div className='h-4 p-1 bg-orange-300 rounded-full text-xs flex justify-center items-center text-primary-400'>100</div>*/}
                        </div>
                        <div className='navLink'>
                            <TbUser className='w-5 h-5 text-orange-300'></TbUser>
                            Profile
                        </div>
                        <div className='navLink'>
                            <TbSettings className='w-5 h-5 text-orange-300'></TbSettings>
                            Settings
                        </div>
                        <div className='navLink'>
                            <TbBell className='w-5 h-5 text-orange-300'></TbBell>
                            Notifications
                        </div>
                    </div>
                    {user && 
                        <div className='w-full flex items-center gap-2 justify-center'>
                            <p>Logged as <span className='text-orange-300'>{user.username}</span></p>
                        </div>    
                    }
                </div>
            </div>
            <div className="w-full text-stone-50">
                {loading ? 
                    <div className='w-full h-full flex justify-center items-center'>
                        <AiOutlineLoading3Quarters className='w-10 h-10 text-primary-100 animate-spin'></AiOutlineLoading3Quarters>
                    </div> : 
                    <div>
                        {children}
                    </div>
                }
            </div>
        </div>
    )
}

export default Layout;