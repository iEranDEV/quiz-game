import Link from "next/link";
import { useRouter } from "next/router";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { TbBell, TbHome, TbSettings, TbUser, TbUsers } from "react-icons/tb";

function NavBar({ menu, setMenu, user }: {menu: boolean, setMenu: Function, user: User | null}) {

    const router = useRouter();

    return (
        <nav className="z-50 flex w-full md:w-auto items-center p-4 md:p-0">
            <HiBars3 onClick={() => setMenu(!menu)} className='w-8 h-8 md:hidden'></HiBars3>

            <div className={`fixed w-screen md:w-20 lg:w-60 h-screen top-0 left-0 flex flex-col bg-primary-300 gap-16 md:gap-0 justify-center md:justify-around items-center transition-all md:static ${menu ? 'left-0' : '-left-full'}`}>
                <div className='flex w-full items-center p-4 absolute top-0 left-0'>
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
                    <div className='navLink'>
                        <TbUsers className='w-5 h-5 text-orange-300'></TbUsers>
                        <p>Friends</p>
                        {/*<div className='h-4 p-1 bg-orange-300 rounded-full text-xs flex justify-center items-center text-primary-400'>100</div>*/}
                    </div>
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
                        <TbBell className='w-5 h-5 text-orange-300'></TbBell>
                        <p>Notifications</p>
                    </div>
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