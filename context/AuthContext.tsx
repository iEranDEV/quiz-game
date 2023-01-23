import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState, createContext } from "react";
import { auth, db } from "../firebase";


// Declaration of auth context
export const AuthContext = createContext<{user: User | null, setUser: Function , loading: boolean, setLoading: Function }>(
    {
        user: null,
        setUser: () => {},
        loading: false,
        setLoading: () => {}
    }
)

export const AuthContextProvider = ({ children }: {children: JSX.Element}) => {
    // Router instance
    const router = useRouter();

    // Function for setting user state
    const setUser = (user: User | null) => {
        setUserState(user);
    }

    // Function for setting loading state
    const setLoading = (loading: boolean) => {
        setLoadingState(loading);
    }

    // State instance
    const [user, setUserState] = useState<User | null>(null);
    const [id, setID] = useState<string | null>(null);
    const [loading, setLoadingState] = useState<boolean>(false);

    // Function ran only on application load
    useEffect(() => {
        const authSession = auth.onAuthStateChanged(async (data) => {
            console.log(data)
            if(data) {
                setLoading(true);
                setID(data.uid)
            } else {
                setID(null);
                router.push('/accounts/login');
            }
        })
        authSession();
    }, []);

    useEffect(() => {
        if(id) {
            const unsubscribe = onSnapshot(doc(db, "users", id), (doc) => {
                setUser(doc.data() as User);
                setLoading(false);
            });

            return () => {
                unsubscribe();
            }
        }
    }, [id]);

    return (
        <AuthContext.Provider value={{user: user, setUser: setUserState, loading: loading, setLoading: setLoadingState}}>
            {children}
        </AuthContext.Provider>
    )
    
}