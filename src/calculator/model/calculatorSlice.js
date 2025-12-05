import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    r: 1,
    x: 0,
    points: []
}

const calculatorSlice = createSlice({
    name: "calculator",
    initialState,
    reducers: {
        setR(state, action) {
            state.r = action.payload;
        },
        setX(state, action) {
            state.x = action.payload;
        },
        addPoint(state, action) {
            state.points.push(action.payload);
        },
        clearPoints(state) {
            state.points = [];
        },
        setPoints(state, action) {
            state.points = Array.isArray(action.payload) ? action.payload : [];
        },  
    }
})

export const {setR, setX, addPoint, clearPoints, setPoints } = calculatorSlice.actions;
export default calculatorSlice.reducer;
