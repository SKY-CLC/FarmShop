import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    metrics: null
}

const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {
        loadsellerdata: (state,action) => {
            state.data = action.payload
        },

        loadmetrics: (state,action) => {
            state.metrics = action.payload
        }

    }
})

export default sellerSlice.reducer;
export const { loadsellerdata }  = sellerSlice.actions;
export const { loadmetrics } = sellerSlice.actions;