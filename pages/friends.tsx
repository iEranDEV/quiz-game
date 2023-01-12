import { useRef, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { TbSearch } from "react-icons/tb";
import { useSelector } from "react-redux";
import FriendsList from "../components/friends/FriendsList";
import Requests from "../components/friends/Requests";
import Layout from "../components/layout/Layout";
import { RootState } from "../store/store";

function FriendsPage() {
    const [requestMenu, setRequestMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string | null>('');
    const user = useSelector((state: RootState) => state.user.user);
    const friendsNotification = (user && user.friendRequests.length >= 1 ? true : false);

    const toggleMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        setRequestMenu(!requestMenu);
    }

    const searchRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(searchRef.current) {
            if(searchRef.current.value.length === 0) {
                setSearchQuery(null);
            } else {
                setSearchQuery(searchRef.current.value);
            }
        }
    }

    return (
        <Layout>
            <div onClick={() => setRequestMenu(false)} className="w-full h-full min-h-[80vh] py-4 flex flex-col">
                <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex justify-between items-center relative">
                        <p className="text-primary-100 tracking-widest uppercase font-bold text-xl">Friends</p>
                        <div onClick={(e) => toggleMenu(e)} className="relative">
                            <FaUserFriends className="text-primary-100 h-8 w-8 cursor-pointer"></FaUserFriends>
                            {friendsNotification && <div className="h-2 w-2 bg-orange-300 absolute top-0 right-0 rounded-full"></div>}
                        </div>

                        {(requestMenu && user) && <Requests user={user} setMenu={setRequestMenu}></Requests>}
                    </div>
                    <form onSubmit={(e) => handleSubmit(e)} className="w-full md:w-60 h-10 flex items-center gap-4">
                        <button type="submit"><TbSearch className="text-primary-100 cursor-pointer hover:text-primary-300 w-5 h-5"></TbSearch></button>
                        <input type="text" className="form-control" placeholder="Find a friend" ref={searchRef} />
                    </form>
                </div>
                {user && <FriendsList searchQuery={searchQuery} user={user}></FriendsList>}
            </div>
        </Layout>
    )
}

export default FriendsPage;