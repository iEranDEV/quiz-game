import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { HiXMark } from "react-icons/hi2";
import { TbUser, TbLockSquare, TbQuestionMark, TbShieldCheck, TbDiamond, TbLogout } from "react-icons/tb";
import { AuthContext } from "../../context/AuthContext";
import { auth } from "../../firebase";


function SettingsLayout({ children }: {children: JSX.Element}) {
    const [menu, setMenu] = useState(false);

    const router = useRouter();
    const authContext = useContext(AuthContext);

    const handleLogOut = () => {
        auth.signOut().then(() => {

            authContext.setUser(null);
            router.push('/accounts/login');
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="w-full h-full flex lg:border-l border-primary-200 -mx-4">
            <nav className={`z-10 fixed lg:static bg-primary-300 md:pl-20 lg:pl-0 w-full lg:w-80 justify-start gap-2 items-center h-full text-primary-100 transition-all flex flex-col ${menu ? 'right-0' : '-right-full'}`}>
                <div className='flex w-full items-center p-4'>
                    <HiXMark onClick={() => setMenu(!menu)} className='w-8 h-8 lg:hidden cursor-pointer'></HiXMark>
                </div>

                <Link onClick={() => setMenu(false)} href="/settings/user" className={`settingsLink ${router.pathname === ('/settings/user') && 'bg-primary-400/30 lg:border-r-4 lg:border-orange-300'}`}>
                    <TbUser className='w-5 h-5 text-orange-300'></TbUser>
                    <p>User profile</p>
                </Link>
                <Link onClick={() => setMenu(false)} href="/settings/test" className={`settingsLink ${router.pathname === ('/settings/test') && 'bg-primary-400/30 lg:border-r-4 lg:border-orange-300'}`}>
                    <TbLockSquare className='w-5 h-5 text-orange-300'></TbLockSquare>
                    <p>Change password</p>
                </Link>
                <div className="settingsLink text-red-300" onClick={() => handleLogOut()}>
                    <TbLogout className="w-5 h-5 text-red-400"></TbLogout>
                    <p>Log out</p>
                </div>
            </nav>
            <div className="w-full h-full flex flex-col">
                <div className="w-full p-4 cursor-pointer lg:cursor-auto" onClick={() => setMenu(true)}>
                    <p className="text-primary-300 tracking-widest uppercase font-bold text-xl">Settings</p>
                    <span className="text-primary-100 font-semibold lg:hidden">Click to open settings menu</span>
                </div>
                <div className="w-full h-full px-4 py-8">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SettingsLayout;