import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    array: [],
};

export const SelectedFileLayerArraySlice = createSlice({
    name: "ReactangleArray",
    initialState,
    reducers:{
        addFileLayer: (state, action) => {
            console.log(action);
            state.array.push(action.payload);
        },
        deleteFileLayer: (state, action)=>{
            // console.log("inside delete rectangle");
            // console.log(action);
            // state.array = state.array.filter(
            //     currentRectInfo => !arraysEqual(currentRectInfo.coordinates, action.payload)
            // )
            state.array = state.array.filter((currentLayerInfo) => currentLayerInfo.layerId !== action.payload)
        }
    }
})


export const { addFileLayer, deleteFileLayer } = SelectedFileLayerArraySlice.actions;
export default SelectedFileLayerArraySlice.reducer;