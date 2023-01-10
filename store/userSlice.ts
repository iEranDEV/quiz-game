import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    user: null as User | null,
    loading: false
}


export const userSlice = createSlice({
    name: 'user',

    initialState,

    reducers: {
        /*
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload)
        },
        */
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    }
})

export const { setUser, setLoading } = userSlice.actions;

export default userSlice.reducer;