import axios from '../../services/axiosconfig'
import { toast } from 'react-toastify'
import { loaduser } from '../reducers/userSlice'


export const asyncregisteruser = (user) => async (dispatch, getState) => {
    try {

        const res = await axios.post("/api/auth/register", user);

        if(res)
            dispatch(loaduser(user));
        else
            toast.error("Registration failed!")
        
    } catch (err) {
        console.error(err);
    }
}


export const asyncloginuser = (user) => async (dispatch, getState) => {

   
   try {
   const res = await axios.post("/api/auth/login", user);

  dispatch(loaduser(res?.data?.user));

  toast.success("Login Successfully");

} catch (err) {
    console.log(err);
    toast.error("Login failed");
}

}


export const asyncgetuser =  () => async (dispatch,getState) => {

   try {

    const res = await axios.get('/api/auth/me');

    dispatch(loaduser(res?.data?.user));

    
   } catch (error) {
       console.log(error)
   }


}

export const asynclogoutuser = () => async (dispatch,getState) => {

    try {

        const res = await axios.get('/api/auth/logout');

        dispatch(loaduser(null));

        toast.success("Logout Successfully");

        
    } catch (error) {
        console.log(error);
    }

}
