import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { asyncloadproducts } from "../store/actions/productActions";
import { useEffect } from "react";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";

export default function Products() {

const { register,handleSubmit,reset }  = useForm();
const dispatch = useDispatch();
const navigate = useNavigate();

  const categories = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Nuts",
  ];

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
            "linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1778439802723-51bc5b13e589?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
      </div>


      <div className="flex gap-7 p-6 font-poppins">
     
         <form onSubmit={handleSubmit(onApplyFilters)}>
      <aside className="w-60 shrink-0 border-r border-gray-200 pr-5">
        <h2 className="text-3xl font-medium text-gray-900 mb-4">FILTER BY</h2>
        <hr className="border-gray-200 mb-4" />
          
        
        <div className="mb-5">
          <p className="text-xl font-medium text-gray-400 uppercase tracking-widest mb-2.5">
            Category
          </p>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                value={cat}
                {...register("category")}
                className="w-3.5 h-3.5 accent-green-700 cursor-pointer"
                />
              <span className="text-lg text-gray-700">{cat}</span>
            </label>
          ))}
        </div>

        <hr className="border-gray-200 mb-4" />

       
        <div className="mb-5">
          <p className="text-xl font-medium text-gray-400 uppercase tracking-widest mb-2.5">
            Price range
          </p>
          <div className="flex items-center gap-1.5 ">
            <span className="text-lg text-gray-400">₹</span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              {...register("minPrice")}
              className="w-14 no-spinner text-md px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            <span className="text-sm text-gray-400">—</span>
            <input
              type="number"
              min = "0"
              placeholder="Max"
              {...register("maxPrice")}
              className="w-14 no-spinner text-md px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
          </div>
        </div>

        <hr className="border-gray-200 mb-4" />

       
        <div className="mb-4">
          <p className="text-xl font-medium text-gray-400 uppercase tracking-widest mb-2.5">
            Radius
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="e.g. 50"
              {...register("radius")}
              className="w-20 no-spinner text-md px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            <span className="text-lg text-gray-400">km</span>
          </div>
        </div>
       
        <button
          type="submit"
          className="mt-4 w-full py-1.5 text-lg bg-[#333] text-white rounded-lg hover:bg-black transition-colors"
          >
          Apply Filters
        </button>
        
      </aside>
      </form> 

      <main className="flex-1 min-w-0">
        <p className="text-sm text-gray-400 mb-4">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>

        {products.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">
            No products match your filters.
          </p>
        ) : (
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
        )}
      </main>
    </div>

      
     
      <Footer />
      
    </div>
  );
}