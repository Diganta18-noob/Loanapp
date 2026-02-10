import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    isAuthenticated: !!localStorage.getItem('token'),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = { userName: action.payload.userName, id: action.payload.id };
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('role', action.payload.role);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
        },
    },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
