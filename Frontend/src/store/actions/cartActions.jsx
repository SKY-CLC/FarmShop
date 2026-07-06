import axios from '../../services/axioscartconfig'
import { toast } from 'react-toastify'
import { loadcart } from '../reducers/cartSlice'

export const asyncadditemtocart = (product) => async (dispatch,getState) =>{

     try {


         const res = await axios.post('/api/cart/items',product);


         dispatch(loadcart(res?.data?.cart));

         toast.success("Item added to cart successfully");
        
     } catch (error) {
        toast.error( error.response?.data?.message || error.message);
        console.log(error);
     }

}

export const asyncgetcart = () => async (dispatch,getState) => {

  try {

     const res = await axios.get('/api/cart/');

     dispatch(loadcart(res?.data?.cart));
    
  } catch (error) {
     toast.error( error.response?.data?.message || error.message);
     console.log(error);
  }


}

export const asyncupdatecartitem = (data) => async (dispatch,getState) => {

  try {

   const res = await axios.patch(`/api/cart/items/${data.id}`,{quantity: data.quantity});   

   dispatch(loadcart(res?.data?.cart));

   
  } catch (error) {
       
       toast.error( error.response?.data?.message || error.message);
       console.log(error);
  }



}


export const asyncdeletecartitem = (id) => async (dispatch,getState) => {

  try {

   console.log(id);

   const res = await axios.delete(`/api/cart/${id}`);
   dispatch(loadcart(res?.data?.cart));

   
  } catch (error) {
       toast.error( error.response?.data?.message || error.message);
       console.log(error);
  }

}