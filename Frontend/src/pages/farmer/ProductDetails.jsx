import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { asyncgetproductbyid, asyncdeleteproduct } from "../../store/actions/productActions";
import { asyncadditemtocart } from "../../store/actions/cartActions";




const ProductDetails =  () => {

  const dispatch = useDispatch();

  const navigate = useNavigate()

  const { id } = useParams();
    
  const user = useSelector((state) => state.users.data);

  const products = useSelector((state) => state.products.data);

  const product = products?.find((p) => p._id === id);

  useEffect(() => {

    if(!product )
      dispatch(asyncgetproductbyid(id));

  }, [id,product,dispatch])

  const META = [
  { label: "Category ",     value: product?.category },
  { label: "Quantity in Kg", value: product?.quantity },
  { label: "Harvest date", value: product?.harvestDate.split("T")[0] },
  { label: "Expiry date",  value: product?.expiryDate.split("T")[0] },
];


  const deleteProduct = (id) =>
  {
     dispatch(asyncdeleteproduct(id));
     navigate('/products');
  }




  return (
    <main className=" bg-white relative overflow-hidden min-h-screen">

      {/* ── Hero ── */}
      <div className="bg-white  flex relative z-20 items-center overflow-hidden border-b border-gray-100 ">
        <div className="container mx-auto px-6 flex relative py-16 gap-8">

          {/* Left text */}
          <div className="sm:w-2/3 lg:w-2/5 flex flex-col justify-center relative z-20">
            

            <h1 className="font-bebas-neue uppercase font-black flex flex-col leading-none  text-gray-800">
           
              <span className="text-6xl ">{product?.title}</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-700  mt-4 mb-8">
              {product?.description}
            </p>

            {user?.role === "farmer"  && (<div className="flex gap-4">
              <button
                 onClick={() => navigate(`/farmer/editproduct/${product._id}`)}
                className="uppercase cursor-pointer py-2 px-4 rounded-lg bg-gray-900  border-2 border-transparent text-white  text-md hover:bg-gray-700  transition-colors"
              >
                Edit Product
              </button>
              <button
                onClick={()=>deleteProduct(product._id)}
                className="uppercase cursor-pointer py-2 px-4 rounded-lg bg-transparent border-3 border-gray-900  text-gray-900  hover:bg-gray-900 hover:text-white   text-md transition-colors"
              >
                Delete product
              </button>
            </div>)}
          </div>

         
          <div className="hidden sm:flex sm:w-1/3 lg:w-3/5 items-center justify-center">
           
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-xl border border-gray-200  bg-gray-50  flex items-center justify-center">
              <img
                src= {product?.image.url}
                className="w-68 h-68 rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      
      <div id="details" className="container mx-auto px-6 py-12">

        <p className="text-xs uppercase tracking-widest text-gray-600 font-medium mb-6 pb-4 border-b border-gray-100 ">
          Product details — {product?.title}
        </p>

        {/* Meta cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-10">
          {META.map(({ label, value }) => (
            <div key={label} className="bg-gray-50  rounded-xl px-4 py-3">
              <p className={`text-xs ${label === "Expiry date" ? "text-red-500" : "text-gray-400" } ${label === "Harvest date" ? "text-green-600" : "text-gray-400" } mb-1`}>{label}</p>
              <p className="text-sm font-medium text-gray-900 ">{value}</p>
            </div>
          ))}
        </div>

        {/* Purchase row */}
        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100 ">

          {/* Price */}
          <div>
            <p className="text-3xl font-black text-gray-900">
              ₹{product?.price?.amount}.00 
            </p>
            <p className="text-xs text-gray-400 mt-0.5">per Kg</p>
          </div>



          {/* Add to cart */}
         { user.role === 'shopkeeper' && ( <button onClick={()=> {
            //console.log(product._id);
            dispatch(asyncadditemtocart({productId: product._id}))
            }} className="ml-auto uppercase cursor-pointer py-2 px-6 rounded-lg bg-gray-900  text-white  text-sm font-medium hover:bg-gray-700  transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Add to cart
          </button> )}
        </div>
      </div>
    </main>
  );
}


export default ProductDetails;
