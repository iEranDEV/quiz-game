export {};

declare global {
    type User = {
        uid: string,
        username: string,
        email: string,
        photoURL: string | null,
    }

}