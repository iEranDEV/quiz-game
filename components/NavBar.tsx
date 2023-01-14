import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from 'react';
import { HiBars3, HiXMark } from "react-icons/hi2";
import { TbHome, TbSettings, TbUser, TbUsers, TbBulb } from "react-icons/tb";
import { VscDashboard } from 'react-icons/vsc'
import { AuthContext } from "../context/AuthContext";

function NavBar({ menu, setMenu }: {menu: boolean, setMenu: Function}) {

    const authContext = useContext(AuthContext);
    const user = authContext.user;

    const router = useRouter();

    const friendsNotification = (user && user.friendRequests.length >= 1 ? true : false)

    return (
        <nav className="z-50 flex w-full md:w-auto items-center p-4 md:p-0">
            <HiBars3 onClick={() => setMenu(!menu)} className='w-8 h-8 md:hidden'></HiBars3>

            <div className={`fixed w-screen md:w-20 lg:w-60 h-screen top-0 left-0 flex flex-col bg-primary-300 gap-16 md:gap-0 justify-center md:justify-around items-center transition-all md:static ${menu ? 'left-0' : '-left-full'}`}>
                <div className='flex md:hidden w-full items-center p-4 absolute top-0 left-0'>
                    <HiXMark onClick={() => setMenu(!menu)} className='w-8 h-8 md:hidden'></HiXMark>
                </div>

                <p style={{fontFamily: 'Bouncy'}} className='text-3xl text-orange-300 block md:hidden lg:block'>quizly</p>

                <div className='flex flex-col w-full justify-center items-center'>
                    <Link href="/" className='w-full'>
                        <div className={`navLink ${router.pathname === '/' && 'bg-primary-400/30 md:border-r-4 md:border-orange-300'}`}>
                            <TbHome className='w-5 h-5 text-orange-300'></TbHome>
                            <p>Home</p>
                        </div>
                    </Link>
                    <Link href="/friends" className="w-full">
                        <div className={`navLink ${router.pathname === '/friends' && 'bg-primary-400/30 md:border-r-4 md:border-orange-300'}`}>
                            <TbUsers className='w-5 h-5 text-orange-300'></TbUsers>
                            <p>Friends</p>
                            {friendsNotification && <p className="bg-primary-200 text-stone-50 rounded-full p-1 text-xs">{user?.friendRequests.length}</p>}
                        </div>
                    </Link>
                    <div className='navLink'>
                        <TbUser className='w-5 h-5 text-orange-300'></TbUser>
                        <p>Profile</p>
                    </div>
                    <Link href="/settings/user" className='w-full'>
                        <div className={`navLink ${router.pathname.includes('/settings') && 'bg-primary-400/30 md:border-r-4 md:border-orange-300'}`}>
                            <TbSettings className='w-5 h-5 text-orange-300'></TbSettings>
                            <p>Settings</p>
                        </div>
                    </Link>
                    <div className='navLink'>
                        <TbBulb className='w-5 h-5 text-orange-300'></TbBulb>
                        <p>Send an idea</p>
                    </div>
                    {user?.role === 'ADMIN' && <Link href="/admin/" className='w-full'>
                        <div className={`navLink ${router.pathname.includes('/admin') && 'bg-primary-400/30 md:border-r-4 md:border-orange-300'}`}>
                            <VscDashboard className='w-5 h-5 text-orange-300'></VscDashboard>
                            <p>Dashboard</p>
                        </div>
                    </Link>}
                </div>
                {user && 
                    <div className='w-full flex items-center gap-2 justify-center text-sm md:hidden lg:flex'>
                        <p>Logged as <span className='text-orange-300'>{user.username}</span></p>
                    </div>    
                }
            </div>
        </nav>
    )
}

export default NavBar;