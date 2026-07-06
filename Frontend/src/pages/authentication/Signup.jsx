import { useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { nanoid } from 'nanoid'
import { asyncregisteruser } from "../../store/actions/userActions";
import { useDispatch } from 'react-redux'
import { toast } from "react-toastify";


const Signup = () => {

  const { register, reset, handleSubmit, error, setValue } = useForm(); 
   const navigate = useNavigate();
   const dispatch = useDispatch();

  const getLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
 };

  
  const SignupHandler = async (user) => {

     const position = await getLocation()
     
      const location = {
        type: "Point",
        coordinates: [
          position.coords.longitude,
          position.coords.latitude
        ]
      }
      
      user.location = location;

       dispatch(asyncregisteruser(user));
       toast.success("User Registered Successfully");
       reset();

       navigate('/');
  }

  

  return (
    <div className=" flex items-center justify-center h-[calc(100vh-68px)] w-full">
    <div className="rounded-md bg-white p-8 shadow-sm w-full max-w-md">
        
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>

          </div>
          <h1 className="mb-2 text-2xl font-bold text-black">Create Account</h1>
          <p className="text-sm text-gray-600">Join us today and get started with your account</p>
        </div>

      
        <form onSubmit={handleSubmit(SignupHandler)} className="space-y-6">
          
          
              <input  {...register("name")}  type="text"  className="w-full outline-0 border-b px-4 py-2 " placeholder="Enter Your Name" required />

              <div className="space-y-3">
  

  <div>
    <label  className="flex items-center justify-between gap-4 rounded border border-gray-300 bg-white p-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 has-checked:border-blue-600 has-checked:ring-1 has-checked:ring-blue-600">
     
        <p className="text-gray-700">Farmer</p>

      <input type="radio"  {...register("role")}  value="farmer" className="size-5 border-gray-300"  /> 
    </label>
  </div>

  <div>
    <label  className="flex items-center justify-between gap-4 rounded border border-gray-300 bg-white p-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 has-checked:border-blue-600 has-checked:ring-1 has-checked:ring-blue-600">
        <p className="text-gray-700">Shopkeeper</p>


      <input type="radio"  {...register("role")}  value="shopkeeper"  className="size-5 border-gray-300" />
    </label>
  </div>
</div>

             <input type="text"  {...register("username")}  className="w-full outline-0 border-b px-4 py-2 " placeholder="Enter Your Username" required />
           
             <input type="email"  {...register("email")} className="w-full outline-0 border-b px-4 py-2" placeholder="Enter Your Email" required />
           <div>
             <input type="password"  {...register("password")} placeholder="Create a strong password" className="w-full px-4 py-2 border-b outline-0 " />
             <p className=" px-4 mt-2 text-xs text-gray-500">Must be at least 8 characters with numbers and symbols</p>
            </div>
         

         <button onClick={getLocation} className="w-full relative px-5 py-3 font-semibold text-black after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:bg-gray-800 hover:text-white hover:after:h-full focus:outline-0" >
          <span className="relative z-10"> Create Account</span>
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
      Already have an account?
      <button onClick={()=>navigate("/login")} className="text-green-600 font-semibold hover:underline border-0 " >
        Log in
      </button>
    </p>
      </div>
      </div>
  )
}

export default Signup