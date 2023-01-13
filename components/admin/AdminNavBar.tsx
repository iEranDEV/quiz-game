import Link from "next/link";
import { useRouter } from "next/router";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { TbBulb, TbHome, TbUser } from "react-icons/tb";
import { BiCategoryAlt, BiQuestionMark } from 'react-icons/bi'
import { VscDashboard } from 'react-icons/vsc'

function NavBar({ menu, setMenu, user }: {menu: boolean, setMenu: Function, user: User | null}) {

    const router = useRouter();

    return (
        <nav className="z-50 flex w-full md:w-auto items-center p-4 md:p-0">
            <HiBars3 onClick={() => setMenu(!menu)} className='w-8 h-8 md:hidden'></HiBars3>

            <div className={`fixed w-screen md:w-20 lg:w-60 h-screen top-0 left-0 flex flex-col bg-primary-300 gap-16 md:gap-0 justify-center md:justify-around items-center transition-all md:static ${menu ? 'left-0' : '-left-full'}`}>
                <div className='flex md:hidden w-full items-center p-4 absolute top-0 left-0'>
                    <HiXMark onClick={() => setMenu(!menu)} className='w-8 h-8 md:hidden'></HiXMark>
                </div>

                <p style={{fontFamily: 'Bouncy'}} className='text-3xl text-orange-300 block md:hidden lg:block'>dashboard</p>

                <div className='flex flex-col w-full justify-center items-center'>
                    <Link href="/admin" className='w-full'>
                        <div className={`navLink ${router.pathname === '/admin' && 'bg-primary-400/30 md:border-r-4 md:border-orange-300'}`}>
                            <VscDashboard className='w-5 h-5 text-orange-300'></VscDashboard>
                            <p>Dashboard</p>
                        </div>
                    </Link>
                    <div className='navLink'>
                        <TbBulb className='w-5 h-5 text-orange-300'></TbBulb>
                        <p>Ideas</p>
                    </div>
                    <Link href="/admin/questions" className='w-full'>
                        <div className={`navLink ${router.pathname === '/admin/questions' && 'bg-primary-400/30 md:border-r-4 md:border-orange-300'}`}>
                            <BiQuestionMark className='w-5 h-5 text-orange-300'></BiQuestionMark>
                            <p>Questions</p>
                        </div>
                    </Link>
                    <Link href="/admin/categories" className='w-full'>
                        <div className={`navLink ${router.pathname === '/admin/categories' && 'bg-primary-400/30 md:border-r-4 md:border-orange-300'}`}>
                            <BiCategoryAlt className='w-5 h-5 text-orange-300'></BiCategoryAlt>
                            <p>Categories</p>
                        </div>
                    </Link>
                    <div className='navLink'>
                        <TbUser className='w-5 h-5 text-orange-300'></TbUser>
                        <p>Users</p>
                    </div>
                    <Link href="/" className='w-full'>
                        <div className={`navLink`}>
                            <TbHome className='w-5 h-5 text-orange-300'></TbHome>
                            <p>Home</p>
                        </div>
                    </Link>
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