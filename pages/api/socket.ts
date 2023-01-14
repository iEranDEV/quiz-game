import { Server } from 'socket.io';

const users = new Map<string, string>();

const SocketHandler = (req: any, res: any) => {
    // console.log(req.query.uid);
    if(res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing');
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            const uid = req.query.uid;
            users.set(uid, socket.id);

            console.log(`Initialized connection with user (${uid}), id: ${socket.id}`);

            socket.on('disconnect', () => {
                users.delete(uid);
            })
        })
    }
    res.end();
}

export default SocketHandler;