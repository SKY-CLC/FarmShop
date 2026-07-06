import { configureStore } from '@reduxjs/toolkit';
import userSlice from './reducers/userSlice';
import cartSlice from './reducers/cartSlice';
import productSlice from './reducers/productSlice';
import orderSlice from './reducers/orderSlice';
import searchSlice from './reducers/searchSlice'
import sellerSlice from './reducers/sellerSlice'

export const store = configureStore({
  reducer: {
    users: userSlice,
    products: productSlice,
    carts: cartSlice,
    orders: orderSlice,
    search: searchSlice,
    seller: sellerSlice
  },
})