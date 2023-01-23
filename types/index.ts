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
        players: [string, string | null],
        questions: Array<Question>,
        mode: 'solo' | 'vs',
        status: 'waiting' | 'canceled' | 'finished' | 'quiz',
        data: {
            host: {
                uid: string,
                answers: Array<string | null>,
                correct: Array<boolean>
            },
            player: {
                uid: string,
                answers: Array<string | null>,
                correct: Array<boolean>
            } | null
        },
        category: string,
    }

    type GameRequest = {
        id: string,
        sender: string,
        receiver: string,
        endTime: Date,
        categoryName: string,
    }

}