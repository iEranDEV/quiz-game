import { doc, getDoc } from 'firebase/firestore';
import { Server } from 'socket.io';
import { db } from '../../firebase';

const users = new Map<string, string>();

const SocketHandler = (req: any, res: any) => {
    if(!res.socket.server.io) {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            const uid = req.query.uid;
            users.set(uid, socket.id);

            console.log(`Initialized connection with user (${uid}), id: ${socket.id}`);

            socket.on('disconnect', () => {
                users.delete(uid);
            })

            socket.on('get-friends-activity', async () => {
                const arr = Array<string>();
                const docSnap = await getDoc(doc(db, "users", uid));
                if(docSnap.exists()) {
                    const user = docSnap.data() as User;
                    user.friends.forEach((element) => {
                        if(users.has(element)) arr.push(element);
                    })
                }
                socket.emit('friends-activity', arr);
            })
        })
    }
    res.end();
}

export default SocketHandler;