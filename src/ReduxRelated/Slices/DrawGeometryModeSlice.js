import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: null,
};  

export const DrawGeometryModeSlice = createSlice({
    name:"latLngSlice",
    initialState,
    reducers:{
        setDrawGeometryMode(state, action){
            state.mode = action.payload;
        }
    }
})

export const { setDrawGeometryMode } =  DrawGeometryModeSlice.actions;
export default DrawGeometryModeSlice.reducer;