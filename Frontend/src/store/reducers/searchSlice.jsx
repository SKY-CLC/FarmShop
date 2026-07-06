import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null
};


const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        loadsearch: (state, action) => {
            state.data = action.payload;  
        }
    },
});


export const { loadsearch } = searchSlice.actions;

export default searchSlice.reducer;