import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    usersWinRate: {},
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setUsersWinRate(state, action) {
            state.usersWinRate = action.payload;
        },
    }
})

export const { setUsersWinRate } = adminSlice.actions;
export default adminSlice.reducer;
