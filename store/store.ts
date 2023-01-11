import { configureStore } from "@reduxjs/toolkit";
import notificationsSlice from "./notificationsSlice";
import userSlice from "./userSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        notifications: notificationsSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch