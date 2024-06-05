import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    array: [],
};

export const PolygonArraySlice = createSlice({
    name: "PolygonArray",
    initialState,
    reducers:{
        addPolygon: (state, action) => {
            state.array.push(action.payload);
        },
        deletePolygon: (state, action)=>{
            state.array = state.array.filter((currentPolygonInfo) => currentPolygonInfo.id !== action.payload)
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

export const { addPolygon, deletePolygon } = PolygonArraySlice.actions;
export default PolygonArraySlice.reducer;