import axios from '../../services/axiossellerconfig'
import { toast } from 'react-toastify'
import { loadsellerdata, loadmetrics } from '../reducers/sellerSlice'

export const asyncgetmetrics = () => async (dispatch,getState) => {
    try {

        const res = await axios.get('/api/seller/dashboard/metrics');
        
        dispatch(loadmetrics(res?.data));
        
    } catch (error) {
        console.log(error);
    }
}


export const asyncgetsellerorders = () => async (dispatch,getState) => {
    try {

        const res = await axios.get('/api/seller/dashboard/orders');

        try{
            
            dispatch(loadsellerdata(res?.data?.orders))
        }
        catch(err)
        {
            console.log(err)
        }


        
        
    } catch (error) {
        console.log(error);
    }
}


export const asyncacceptorder = (orderId) => async (dispatch,getState) => {

    try {

        const res = await axios.patch(`/api/seller/dashboard/accept/${orderId}`);
        
    } catch (error) {
        console.log(error);
    }

}

export const asyncrejectorder = (orderId) => async (dispatch,getState) => {

    try {
        
        const res = await axios.patch(`/api/seller/dashboard/reject/${orderId}`);

    } catch (error) {
        console.log(error);
    }

}