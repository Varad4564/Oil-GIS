import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    array: [],
}

let CircleArraySlice = createSlice({
    name: "CircleArraySlice",
    initialState,
    reducers:{
        addCircle: (state, action) => {
            state.array.push(action.payload)
        },
        deleteCircle: (state, action) => {
            state.array = state.array.filter((currentCircleInfo)=> currentCircleInfo.id !== action.payload)
        }
    },
})

export const {addCircle, deleteCircle} = CircleArraySlice.actions;
export default CircleArraySlice.reducer;