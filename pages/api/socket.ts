import Channels from "pusher";

const users = Array<string>();

export const pusher = new Channels({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID as string,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
    secret: process.env.NEXT_PUBLIC_PUSHER_SECRET as string,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
});

export default async function handler(req: any, res: any) {
    const { type, id, data } = req.body;

    switch(type) {
        case 'connect':
            if(!users.includes(id)) users.push(id);
            res.json();
            break;
        case 'disconnect':
            users.splice(users.findIndex(element => element === id), 1);
            res.json();
            break;
        case 'get_friends':
            const toReturn = Array<string>();
            if(data) {
                (data as Array<string>).forEach((element: any) => {
                    if(users.includes(element)) toReturn.push(element);
                })
            }
            res.json(toReturn);
            break;
        case 'send_request':
            pusher.trigger(data.player, "send_request", {
                data: data,
            })
            res.json();
            break;
        case 'accept_request':
            const newGame = JSON.parse(JSON.stringify(data)) as Game;
            const host = newGame.host;
            pusher.trigger(host, "start_game", {
                id: newGame.id,
            });
            newGame.host = id;
            newGame.player = host;
            newGame.loading = false;
            res.json({game: newGame});
            break;
        case 'update':
            pusher.trigger(data.player, 'update', {
                playerPoints: data.answers.host,
            })
            res.json();
            break;
    }
}