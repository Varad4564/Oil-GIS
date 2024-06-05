import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isFullScreen: false,
};  

export const FullScreenSlice = createSlice({
    name:"latLngSlice",
    initialState,
    reducers:{
        toggleFullScreenState(state){
            state.isFullScreen = !state.isFullScreen;
        }
    }
})

export const { toggleFullScreenState } =  FullScreenSlice.actions;
export default FullScreenSlice.reducer;