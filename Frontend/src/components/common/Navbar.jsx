import { NavLink } from "react-router-dom"
import SearchBar from "../products/SearchBar"
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { asynclogoutuser } from "../../store/actions/userActions"


const Navbar = () => {


     const navigate = useNavigate();
     const dispatch = useDispatch();

     const location = useLocation();
     const user =  useSelector((state) => state.users.data);


     const handleLogout = async () => {
         
       await dispatch(asynclogoutuser());

       navigate('/');

     }

  return (
    
    <header className="sticky top-0 shadow z-150 bg-white">
        <div className="max-w-7xl mx-auto px-5">

    <nav className="flex  justify-center flex-wrap  items-center gap-x-10 font-poppins text-xl py-5">
       
      
      
       {  user ? ( <>

       { user.role === "farmer" &&  (
       <>
       <NavLink to="/farmer/dashboard">My Products</NavLink>
       <NavLink to="/farmer/addproduct">Create Product</NavLink>
       <NavLink to="/farmer/orders">Orders</NavLink> 
       </>
       )}
       
       { user.role === "shopkeeper" &&  (
       <>
       <NavLink to="/shopkeeper/dashboard">My Orders</NavLink>
         {location.pathname === "/products" && (<SearchBar />)}
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/cart">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
       </svg>

      </NavLink>

       </>
       )}


       <button 
       className="bprder-0 bg-none cursor-pointer"
       onClick={() => handleLogout()}
       >Logout</button>

       </> ) : ( <> 
       
       
       <NavLink to="/">Home</NavLink>
       {location.pathname === "/products" && (<SearchBar />)}
      <NavLink to="/products">Products</NavLink>
       <NavLink to="/login">Log in</NavLink>
       <NavLink to="/signup">Sign Up</NavLink>

       
       </> )}
      
      


    
    </nav>
    </div>
    </header>
  )
}

export default Navbar