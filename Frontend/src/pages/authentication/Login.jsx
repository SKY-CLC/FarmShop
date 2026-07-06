import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { asyncloginuser } from "../../store/actions/userActions";

const Login = ()=> {
      
    const { register, handleSubmit, reset, error } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const SubmitHandler = (user) => {
        

        dispatch(asyncloginuser(user));
        reset();
        navigate('/products');
    }

    return (
<div className=" flex items-center justify-center h-[calc(100vh-68px)] w-full">

  <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
    
   
    <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Back</h2>
    <p className="text-gray-500 text-center mt-2">Login to your account</p>

   
    <form onSubmit={handleSubmit(SubmitHandler)} className="mt-6 space-y-4">
      
      
        <input {...register("userId")} type="text" placeholder="Enter your email"
          className="w-full px-4 py-2  border-b outline-0" />
      

   
        <input {...register("password")} type="password" placeholder="Enter your password"
          className="w-full px-4 py-2 border-b outline-0 " />
      

       <button  className="w-full relative px-5 py-3 font-semibold text-black after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:bg-gray-800 hover:text-white hover:after:h-full focus:outline-0" >
          <span className="relative z-10"> Login </span>
          </button>
     
      <div className="flex items-center gap-3 mt-1 ">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-400 text-sm">OR</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      
     <button  className="w-full flex items-center justify-center gap-2 relative px-5 py-3 font-semibold text-black after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:bg-gray-800 hover:text-white hover:after:h-full focus:outline-0" >
      
         <img src="https://www.svgrepo.com/show/475656/google-color.svg" 
             className=" relative z-10 w-5 h-5" alt="Google Logo" />
        <span className="relative z-10">Login With Google </span>
      </button>

    </form>

    
    <p className="text-center text-gray-600 text-sm mt-6">
      Don't have an account?
      <button onClick={()=>navigate("/signup")} className="text-green-600 font-semibold hover:underline border-0 " >
        Register
      </button>
    </p>

  </div>

</div>
        
    );
}

export default Login;