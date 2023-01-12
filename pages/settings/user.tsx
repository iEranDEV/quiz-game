import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BiUser, BiImage, BiTrash } from "react-icons/bi";
import { MdLibraryAddCheck } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import Layout from "../../components/layout/Layout";
import SettingsLayout from "../../components/layout/SettingsLayout";
import { db, storage } from "../../firebase";
import { addNotification } from "../../store/notificationsSlice";
import { RootState } from "../../store/store";
import { setUser } from "../../store/userSlice";


function UserSettings() {
    const [username, setUsername] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [photo, setPhoto] = useState<null | string>();

    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const fileRef = useRef(null);

    useEffect(() => {
        if(user?.username !== undefined) {
            setUsername(user?.username);
            setPhoto(user?.photoURL);
        }
    }, [user])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        if(target.files) {
            setFile(target.files[0]);
            setPhoto(URL.createObjectURL(target.files[0]));
        }
    }

    const resetPhoto = () => {
        setFile(null);
        setPhoto('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png');
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let url = null as any;
        if(file && photo !== user?.photoURL) {
            const avatarRef = ref(storage, 'avatars/' + user?.uid);
            url = await uploadBytes(avatarRef, file).then(async (snapshot) => {
                return getDownloadURL(snapshot.ref).then((url) => {
                    return url;
                })
            })
        } 
        await updateDoc(doc(db, "users", user?.uid as string), {
            username: username,
            photoURL: url != null ? url : photo,
        }).then(() => {
            let newUser = {...user} as User;
            newUser.username = username as string;
            newUser.photoURL = (url != null ? url : photo);
            dispatch(setUser(newUser));
            router.push('/')
            dispatch(addNotification({
                id: crypto.randomUUID(),
                type: 'success',
                message: 'User profile updated successfully!'
            }))
        }).catch((error) => {
            console.log('error');
        })
    }


    return (
        <Layout>
            <SettingsLayout>
                <form onSubmit={(e) => handleSubmit(e)} className="w-full h-full flex flex-col gap-16">

                    {/* User avatar */}
                    <div className="flex flex-col gap-2">
                        <div className="uppercase text-primary-100 flex gap-2 group items-center">
                            <BiImage className="h-5 w-5 text-orange-300"></BiImage>
                            <p className="text-orange-300 uppercase tracking-widest font-bold text-sm">PHOTO</p>
                            <BiTrash className="w-5 h-5 text-red-300 hidden group-hover:block cursor-pointer"></BiTrash>
                        </div>
                        <input type="file" className="hidden" ref={fileRef} onChange={(e) => handleFileChange(e)} />
                        <div className="flex  items-center gap-4">
                            {photo && <img src={photo} alt="Current avatar" className="w-20 h-20 aspect-square rounded-xl" />}
                            <div onClick={() => (fileRef?.current as any).click()} className="w-full md:w-60 h-20 flex flex-col justify-center px-2 gap-2 items-center text-sm border-dashed border-2 hover:border-orange-400 hover:text-orange-400 cursor-pointer border-orange-300 rounded-xl text-orange-300">
                                <BiImage className="h-7 w-7"></BiImage>
                                <p className="tracking-widest">Click to upload image</p>
                            </div>
                        </div>
                        <div className="text-primary-100">
                            <span>Selected file: </span>
                            {file ? <span className="ml-4">{file?.name}</span> : <span className="ml-4">None</span>}
                        </div>
                        <p onClick={() => resetPhoto()} className="text-red-300 cursor-pointer">Want to reset your profile photo? <span className="text-red-400 font-bold">CLICK</span></p>
                    </div>

                    {/* Username */}
                    <div className="flex flex-col gap-2 max-w-sm">
                        <label htmlFor="username" className="uppercase text-primary-100 flex gap-2">
                            <BiUser className="h-5 w-5 text-orange-300"></BiUser>
                            <p className="text-orange-300 uppercase tracking-widest font-bold text-sm">Username</p>
                        </label>
                        <input type="text" name="username" id="username" className="form-control" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    {/* Confirm button */}
                    <Button bgColor="bg-orange-300" shadowColor="shadow-orange-500" width={'w-full max-w-sm'}>
                        <MdLibraryAddCheck className="text-primary-400 h-5 w-5"></MdLibraryAddCheck>
                        <p className="text-primary-400 font-bold uppercase tracking-widest text-sm">Confirm</p>
                    </Button>
                </form>
            </SettingsLayout>
        </Layout>
    )
}

export default UserSettings;