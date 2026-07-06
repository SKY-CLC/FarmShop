import axios from '../../services/axiosproductconfig'
import { toast } from 'react-toastify'
import { loadproduct, deleteproduct } from '../reducers/productSlice'



export const asyncloadproducts = (data) => async (dispatch,getState) => {

    try {
        
        const res = await axios.get("/api/products",{
            params: data
        });

      dispatch(loadproduct(res?.data?.products));

    } catch (error) {
        console.log(error);
    }

}

export const asyncgetproductbyid = (id) => async (dispatch,getState) => {

    try {

        const res = await axios.get(`/api/products/${id}`);

        dispatch(loadproduct(res?.data?.product));
        
    } catch (error) {
        console.log(error);
    }
    
}


export const asyncdeleteproduct = (id) => async (dispatch,getState) =>  {
    
  try{

     const res = await axios.delete(`/api/products/${id}`);

     dispatch(deleteproduct(id));

     toast.success("Product deleted successfully");

  }
  catch(error)
  {
    toast.error("Error while deleting product");
    console.log(error);
  }

}


export const asynccreateproduct = (product) => async (dispatch, getState) => {

   try {

    const res = await axios.post("/api/products",product);

    toast.success("Product Created Successfully");
    
   } catch (error) {

       toast.error( error.response?.data?.message || error.message)
       console.log(error);

   }
 

}

export const asyncupdateproduct = (id,product) => async (dispatch, getState) => {

    try {

        const res = await axios.patch(`/api/products/${id}`,product);

        toast.success("Product Updated Successfully");
        
    } catch (error) {
        console.log(error);
    }

}