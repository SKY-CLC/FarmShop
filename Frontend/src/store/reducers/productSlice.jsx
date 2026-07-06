import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: []
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        loadproduct: (state,action) => {
           const payload = Array.isArray(action.payload)
               ? action.payload
               : [action.payload];
               state.data = payload;
        },

        

        deleteproduct: (state,action) => {
                state.data = state.data.filter((p) => 
                  p._id !== action.payload
                  )
        }
    }
})

export default productSlice.reducer;
export const { loadproduct } = productSlice.actions;
export const { deleteproduct } = productSlice.actions; 