import axios from '../../services/axiosorderconfig';
import { toast } from 'react-toastify';
import { loadorder, loadstats, pushorder, deleteorder } from '../reducers/orderSlice';

export const asynccreateorder = () => async (dispatch,getState) => {

   try {

    const res = await axios.post('/api/orders');

    toast.success("Order Placed");
    
   } catch (error) {
      
    toast.error( error.response?.data?.message || error.message)
    console.log(error);

   }


}


export const asyncgetorders = () => async (dispatch,getState) => {

   try {
      
      const res = await axios.get('/api/orders/me');


      dispatch(loadorder(res?.data?.orders));
      dispatch(loadstats(res?.data?.stats));

   } catch (error) {
      toast.error( error.response?.data?.message || error.message)
      console.log(error);
   }

}


export const asyncgetorderbyid = (id) => async (dispatch,getState) => {
    
    try {

       const res = await axios.get(`/api/orders/${id}`);
       dispatch(pushorder(res?.data?.order));

       
      
    } catch (error) {
      toast.error( error.response?.data?.message || error.message)
      console.log(error);
    }

}


export const asyncdeleteorder = (id) => async (dispatch, getState) => {

     try {

        const res = await axios.post(`/api/orders/${id}/cancel`);
        dispatch(deleteorder(res?.data?.order));
      
     } catch (error) {
         toast.error( error.response?.data?.message || error.message)
         console.log(error);
     }

}