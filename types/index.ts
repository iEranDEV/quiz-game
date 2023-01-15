export {};

declare global {
    type User = {
        uid: string,
        username: string,
        email: string,
        photoURL: string | null,
        role: 'USER' | 'ADMIN',
        friendRequests: Array<string>,
        friends: Array<string>
    }

    type INotification = {
        id: string,
        type: 'success' | 'info' | 'error',
        message: string
    }

    type Category = {
        id: string,
        name: string,
        description: string,
        color: string,
        photoURL: string | null,
    }
    
    type Question = {
        id: string,
        category: string,
        question: string,
        mediaURL: string | null,
        answers: Array<Answer>,
        correctAnswer: string,
    }

    type Answer = {
        id: string,
        content: string,
    }

    type Game = {
        id: string,
        host: string,
        player: string | null,
        questions: Array<Question>,
        mode: 'solo' | 'vs',
        loading: boolean,
        answers: {host: Array<string>, player: Array<string>},
        category: string,
    }

}