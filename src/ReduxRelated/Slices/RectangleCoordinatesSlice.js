import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    array: null,
};

export const ReactangleCoordinatesSlice = createSlice({
    name: "ReactangleArray",
    initialState,
    reducers:{
        addInital2Points: (state, action) => {
            state.array = action.payload;
        },
        replacingLastCoordinates: (state, action) => {
            state.array = [state.array[0], action.payload];
        },
        setRectangleCoordinatesNull: (state)=>{
            state.array = null;
        }
    }
})

export const { addInital2Points, replacingLastCoordinates, setRectangleCoordinatesNull } = ReactangleCoordinatesSlice.actions;
export default ReactangleCoordinatesSlice.reducer;