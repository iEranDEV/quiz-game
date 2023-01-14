import Button from "../../components/Button";
import { BiLogIn, BiLockAlt, BiError } from 'react-icons/bi';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { MdAlternateEmail } from 'react-icons/md';
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { HiXMark } from "react-icons/hi2";
import { AuthContext } from "../../context/AuthContext";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const authContext = useContext(AuthContext);
    
    const router = useRouter();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await signInWithEmailAndPassword(auth, email, password).then(async (userCredentials) => {
            const userData = userCredentials.user;
            const userSnap = await getDoc(doc(db, "users", userData.uid));
            if(userSnap.exists()) {
                authContext.setUser(userSnap.data() as User);
                router.push('/');
            } else setError('user not found' as any);
        }).catch((error) => {
            setError(error.code);
        })
    }
    
    return (
        <div className="w-screen h-screen bg-primary-300 flex flex-col gap-8 pt-32 items-center px-2">
            <form onSubmit={(e) => handleLogin(e)} className="flex flex-col p-4 gap-6 rounded-xl justify-center items-center text-stone-50 w-full md:w-96">
            <div className="flex justify-between items-center w-full">
                    <Link href='/accounts/register'><h1 style={{fontFamily: 'Bouncy'}} className={`text-3xl ${router.pathname === '/accounts/register' ? 'text-primary-100' : 'text-primary-200'}`}>Sign up</h1></Link>
                    <Link href='/accounts/login'><h1 style={{fontFamily: 'Bouncy'}} className={`text-3xl ${router.pathname === '/accounts/login' ? 'text-primary-100' : 'text-primary-200'}`}>Log in</h1></Link>
                </div>

                {error && <div className="py-4 px-2 bg-orange-400 justify-between rounded-xl w-full flex items-center gap-4">
                    <BiError className="h-6 w-6"></BiError>
                    <p className="w-full">{error}</p>
                    <HiXMark onClick={() => setError(null as any)} className="h-8 w-8 cursor-pointer"></HiXMark>
                </div>}

                <div className="flex justify-center gap-4 w-full">
                    <MdAlternateEmail className="h-5 w-5 text-orange-300"></MdAlternateEmail>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className="login-form" placeholder="E-mail address" />
                </div>

                <div className="flex justify-center gap-4 w-full">
                    <BiLockAlt className="h-5 w-5 text-orange-300"></BiLockAlt>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="login-form" placeholder="Password" />
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