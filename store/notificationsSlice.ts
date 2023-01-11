import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    notifications: Array<INotification>()
}


export const notificationsSlice = createSlice({
    name: 'notifications',

    initialState,

    reducers: {
        addNotification: (state, action: PayloadAction<INotification>) => {
            state.notifications.push(action.payload);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications.splice(state.notifications.findIndex(element => element.id === action.payload), 1);
        }
    }
})

export const { addNotification, removeNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;