import { configureStore } from "@reduxjs/toolkit";
import notificationsSlice from "./notificationsSlice";

export const store = configureStore({
    reducer: {
        notifications: notificationsSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch