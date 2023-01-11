export {};

declare global {
    type User = {
        uid: string,
        username: string,
        email: string,
        photoURL: string | null,
    }

    type INotification = {
        id: string,
        type: 'success' | 'info' | 'error',
        message: string
    }

}