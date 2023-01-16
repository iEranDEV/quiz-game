import { Server } from 'socket.io';

const users = new Map<string, string>();

const SocketHandler = (req: any, res: any) => {
    if(!res.socket.server.io) {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {

            // User disconnect event
            socket.on('disconnect', () => {
                const id = [...Array.from(users.entries())].find((item) => item[1] === socket.id);
                if(id) {
                    users.delete(id[0]);
                }
            })

            // Initialize user connection to storage
            socket.on('user_connect', (id: string) => {
                users.set(id, socket.id);
                console.log(`Initialized connection with user (${id}), id: ${socket.id}`);
            })

            // Get friends activity
            socket.on('get_friends_activity', (friends: Array<string>, callback) => {
                const arr = Array<string>();
                friends.forEach((item) => {
                    if(users.has(item)) arr.push(item);
                })
                callback(arr);
            })

            // User sent game request to server (sent it to player)
            socket.on('game_request', (game: Game) => {
                if(users.get(game.player as string)) {
                    socket.to(users.get(game.player as string) as string).emit('game_request', game);
                }
            })

            // User accepted request
            socket.on('accept_request', (game: Game, callback) => {
                if(users.get(game.host) && users.get(game.player as string)) {
                    socket.to(users.get({...game}.host) as string).emit('start_game', game);
                    const newGame = JSON.parse(JSON.stringify(game)) as Game;
                    const host = game.host;
                    newGame.host = game.player as string;
                    newGame.player = host;
                    newGame.loading = false;
                    callback(newGame);
                }
            })

            // Game update
            socket.on('game_update', (game: Game) => {
                if(users.get(game.player as string)) {
                    socket.to(users.get((game.player as string)) as string).emit('game_update', game);
                }
            })
        })
    }
    res.end();
}

export default SocketHandler;