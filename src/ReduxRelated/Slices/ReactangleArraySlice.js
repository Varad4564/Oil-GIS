import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    array: [],
};

export const ReactangleArraySlice = createSlice({
    name: "ReactangleArray",
    initialState,
    reducers:{
        addReactangle: (state, action) => {
            state.array.push(action.payload);
        },
        deleteRectangle: (state, action)=>{
            // console.log("inside delete rectangle");
            // console.log(action);
            // state.array = state.array.filter(
            //     currentRectInfo => !arraysEqual(currentRectInfo.coordinates, action.payload)
            // )
            state.array = state.array.filter((currentRectInfo) => currentRectInfo.id !== action.payload)
        }
    }
})

// Helper function to check if two arrays are equal
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you have nested arrays, you need to compare them recursively
    for (let i = 0; i < a.length; ++i) {
        if (Array.isArray(a[i]) && Array.isArray(b[i])) {
            if (!arraysEqual(a[i], b[i])) return false;
        } else if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

export const { addReactangle, deleteRectangle } = ReactangleArraySlice.actions;
export default ReactangleArraySlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     latlng: null,
// };