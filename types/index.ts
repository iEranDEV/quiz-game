export {};

declare global {
    type User = {
        uid: string,
        username: string,
        email: string,
        photoURL: string | null,
        role: 'USER' | 'ADMIN',
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
        color: string
    }
    
    type Question = {
        id: string,
        category: string,
        question: string,
        mediaURL: string,
        answers: Array<Answer>,
        currentAnswer: string,
    }

    type Answer = {
        id: string,
        content: string,
    }

}