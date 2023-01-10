import Button from "../../components/Button";
import { BiLogIn, BiLockAlt } from 'react-icons/bi';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { MdAlternateEmail } from 'react-icons/md';
import Link from "next/link";
import { useRouter } from "next/router";

function Login() {
    const router = useRouter();
    
    return (
        <div className="w-screen h-screen bg-primary-300 flex flex-col gap-8 pt-32 items-center px-2">
            <form onClick={(e) => e.preventDefault()} className="flex flex-col p-4 gap-6 rounded-xl justify-center items-center text-stone-50 w-full md:w-96">
            <div className="flex justify-between items-center w-full">
                    <Link href='/accounts/register'><h1 style={{fontFamily: 'Bouncy'}} className={`text-3xl ${router.pathname === '/accounts/register' ? 'text-primary-100' : 'text-primary-200'}`}>Sign up</h1></Link>
                    <Link href='/accounts/login'><h1 style={{fontFamily: 'Bouncy'}} className={`text-3xl ${router.pathname === '/accounts/login' ? 'text-primary-100' : 'text-primary-200'}`}>Log in</h1></Link>
                </div>

                <div className="flex justify-center gap-4 w-full">
                    <MdAlternateEmail className="h-5 w-5 text-orange-300"></MdAlternateEmail>
                    <input type="text" className="w-full bg-primary-300 border-b-2 border-primary-200 placeholder-primary-100" placeholder="E-mail address" />
                </div>

                <div className="flex justify-center gap-4 w-full">
                    <BiLockAlt className="h-5 w-5 text-orange-300"></BiLockAlt>
                    <input type="password" className="w-full bg-primary-300 border-b-2 border-primary-200 placeholder-primary-100" placeholder="Password" />
                </div>

                <Button bgColor="bg-primary-200" shadowColor="shadow-primary-400" width={'w-60'}>
                    <BiLogIn className="h-5 w-5 text-orange-300"></BiLogIn>
                    <p className="">Log in</p>
                </Button>
            </form>
            <p className="text-primary-200">or continue with</p>
            <div className="flex flex-col gap-4">
                <Button bgColor="bg-primary-200" shadowColor="shadow-primary-400" width={'w-60'}>
                    <FaGoogle className="h-5 w-5 text-orange-300"></FaGoogle>
                    <p>Google</p>
                </Button>
                <Button bgColor="bg-primary-200" shadowColor="shadow-primary-400" width={'w-60'}>
                    <FaFacebookF className="h-5 w-5 text-orange-300"></FaFacebookF>
                    <p>Facebook</p>
                </Button>
            </div>
        </div>
    )
}

export default Login;