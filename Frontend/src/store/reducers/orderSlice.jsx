import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    stats: null
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        loadorder: (state,action) => {
             const payload = Array.isArray(action.payload)
               ? action.payload
               : [action.payload];
               state.data = payload;
        },

        loadstats: (state,action) => {
               state.stats = action.payload;
        },

        pushorder: (state,action) => {
            state.data.push(action.payload);
        },

        deleteorder: (state, action) => {
            state.data = state.data.map((odr)=>
                 odr._id === action.payload._id
                 ? action.payload :
                 odr
            )
        }


    }
})

export default orderSlice.reducer;
export const { loadorder, loadstats, pushorder, deleteorder} = orderSlice.actions;