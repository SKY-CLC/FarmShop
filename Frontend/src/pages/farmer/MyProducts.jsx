import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { asyncloadproducts } from "../../store/actions/productActions";
import { useEffect } from "react";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import Footer from "../../components/common/Footer";

const MyProducts = () => {
  const { register,handleSubmit,reset }  = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    
    
      const getLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
     };
    
      
      const search = useSelector(
      (state) => state.search.data
      );
    
      const user = useSelector((state) => state.users.data)
    
    
      const onApplyFilters = async (data) => {
       
        const position = await getLocation();
    
        data.lng = position.coords.longitude
        data.lat = position.coords.latitude
        data.search = search
        data.category = data.category || [];
    
        dispatch(asyncloadproducts(data));
    
        reset();
    };
        
    
        const products = useSelector((state) => state.products.data);
    
    
        const handleClick = (id) => {
          
            if(!user)
            {
               toast.error("Login to see details");
               navigate('/login');
               return;
            }
    
            navigate(`/farmer/product/${id}`);
    
        }
    
    
    
      useEffect(() => {
      const timer = setTimeout(() => {
       dispatch(asyncloadproducts({ q: search }));
      }, 500);
    
      return () => clearTimeout(timer);
    }, [search]);

      return (
    
         <div>
        
          <div
            className="h-90 flex items-center text-center text-white bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1620200423727-8127f75d7f53?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          >
          </div>
    
    
          <div className="flex gap-7 p-6 font-poppins">
    
          <main className="flex-1 min-w-0">
            <p className="px-4 text-sm text-gray-400 mb-4">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
    
            
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <div
                  onClick={()=> handleClick(p._id)}
                    key={p._id}
                    className="border border-gray-200 rounded-xl bg-white overflow-hidden cursor-pointer hover:border-gray-300 transition-colors"
                  >
                    
                    <div className="aspect-square bg-gray-50 flex items-center justify-center text-4xl">
                      <img
                    src={p.image.url}
                    alt = "Error"
                    className="aspect-square rounded-t-xl object-cover border-b-gray-400"
                    />
                    </div>
    
                    
                    <div className="px-3 pb-4 pt-2.5">
                      <span
                        className={`inline-block text-md font-medium text-green-600 py-0.5 rounded-full mb-2 `}
                      >
                        {p.category}
                      </span>
                      <p className="text-lg font-medium text-gray-900 leading-snug mb-1">
                        {p.title}
                      </p>
                      <p className="text-md text-red-500 mb-1.5"> Expiry Date - {p?.expiryDate?.split("T")[0]} </p>
                      <p className="text-md font-medium text-gray-900">₹{p.price.amount}.00</p>
                    </div>
                  </div>
                ))}
              </div>
            
          </main>
        </div>
    
          
         
          
          <Footer />
        </div>
  )
}

export default MyProducts