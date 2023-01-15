import { Server } from 'socket.io';

const users = new Map<string, string>();

const SocketHandler = (req: any, res: any) => {
    if(!res.socket.server.io) {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {

            socket.on('disconnect', () => {
                // Handle disconnect
                const id = [...Array.from(users.entries())].find((item) => item[1] === socket.id);
                if(id) {
                    users.delete(id[0]);
                }
            })

            socket.on('user_connect', (id: string) => {
                users.set(id, socket.id);
                console.log(`Initialized connection with user (${id}), id: ${socket.id}`);
            })

            socket.on('get_friends_activity', (friends: Array<string>, callback) => {
                const arr = Array<string>();
                friends.forEach((item) => {
                    if(users.has(item)) arr.push(item);
                })
                callback(arr);
            })
        })
    }
    res.end();
}

export default SocketHandler;