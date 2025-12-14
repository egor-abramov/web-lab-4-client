import { createSlice } from "@reduxjs/toolkit"
import { jwtDecode } from "jwt-decode";

const initialState = {
    accessToken: '',
    user: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action) {
            const accessToken = action.payload;
            state.accessToken = accessToken;
            if (accessToken) {
                state.user = jwtDecode(accessToken);
            } else {
                state.user = null;
            }
        },
        logout(state) {
            state.accessToken = '';
            state.user = null;
        },
    }
})

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
