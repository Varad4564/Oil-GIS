import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    latlng: null,
};

export const CurrentLatLngSlice = createSlice({
    name:"latLngSlice",
    initialState,
    reducers:{
        setCurrentLatLong(state, action){
            // console.log(action.payload);
            state.latlng = action.payload;
        }
    }
})

export const {setCurrentLatLong} =  CurrentLatLngSlice.actions;
export default CurrentLatLngSlice.reducer;