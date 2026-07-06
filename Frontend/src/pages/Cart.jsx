import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { asyncupdatecartitem, asyncdeletecartitem, asyncgetcart } from "../store/actions/cartActions";
import { asynccreateorder } from "../store/actions/orderActions";


const Cart = () => {

   const dispatch = useDispatch();

   const cart = useSelector((state)=> state.carts.data)

   const products = useSelector((state) => state.products.data);
   

  const cartitems = cart?.items?.map((item) => {
    
    
    
    const product = products?.find((p)=>item.productId.toString() == p._id)

     return  {
       ...product,
       qty: item.quantity
     }

  });


  const updateItemQuantity = (qty) => {
    
    dispatch(asyncupdatecartitem(qty));

  }


  const deleteItemFromCart = (id) => {

     dispatch(asyncdeletecartitem(id));

  }
   

  useEffect(()=>{
    dispatch(asyncgetcart());
  },[]);

   


 const total =
  cartitems?.reduce(
    (sum,item) =>
    sum +  (item?.price?.amount || 0) * item.qty,
    0
  ) || 0;


  
   
  

return (
  <div className="w-full font-poppins flex justify-center gap-10 bg-white py-9 px-8">
    
    <div className="bg-white p-4 rounded-xl flex-1 max-w-5xl">


      { !cart?.items?.length > 0 && (<div className="min-h-[60vh] flex items-center justify-center">
      <h2 className="text-2xl font-semibold text-gray-600">
        Your Cart is Empty
      </h2>
    </div> )}
     {cart?.items?.length > 0 && ( <table className="w-full">
        <thead>
          <tr className="text-center border-b border-gray-300 text-gray-500 text-sm uppercase">
            <th className="text-left py-3">Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>

        

        <tbody>
          
           
          

          { cartitems?.map((item) => (
            <tr
              key={item?._id}
              className="text-center border-b border-gray-100"
            >
              <td className="py-4 text-left">
                <div className="flex items-center gap-3">
                  {/* <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-20 h-20 object-cover"
                  /> */}

                  <span>{item?.title}</span>
                </div>
              </td>

              <td>
                ₹{item?.price?.amount}
              </td>

              <td>
              <div className="flex justify-center  ">
                
                <div className="border flex border-gray-200 rounded-lg overflow-hidden">

            <button
              onClick={() => {

                if(item.qty-1>0)
                updateItemQuantity({
                id: item?._id,
                quantity: item?.qty-1
              })}}
              aria-label="Decrease"
              className="w-9 h-9 flex items-center justify-center bg-gray-100  hover:bg-gray-200  text-gray-700 d text-lg transition-colors"
              >
              −
            </button>
            <span className="w-10 h-9 flex items-center justify-center text-sm font-medium text-gray-900  border-x border-gray-200 ">
              {item?.qty}
            </span>
            <button
              onClick={() => {

                if(item?.qty+1 <= item?.quantity )
                updateItemQuantity({
                id: item?._id,
                quantity: item?.qty+1
              })}}
              aria-label="Increase"
              className="w-9 h-9 flex items-center justify-center bg-gray-100  hover:bg-gray-200  text-gray-700  text-lg transition-colors"
            >
              +
            </button>
              </div>
          </div>
              </td>

              <td>
                ₹
                {item?.price?.amount *
                  item?.qty}
              </td>

              <td>
               <svg  onClick={()=> deleteItemFromCart(item?._id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className="size-7 cursor-pointer hover:scale-110 transition duration-300 size text-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

              </td>
            </tr>
          ))}
        </tbody> 
      </table> )}
    </div>

    {cart?.items?.length > 0 && (<div className="w-96 bg-white rounded-lg p-6 border h-fit">
      <h2 className="text-xl font-semibold mb-5">
        Cart Total
      </h2>

      <div className="flex justify-between py-3 border-b">
        <span>Subtotal</span>
        <span>₹{total}</span>
      </div>

      <div className="flex justify-between py-3 border-b">
        <span>Shipping</span>
        <span>Free</span>
      </div>

      <div className="flex justify-between py-3 font-semibold">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <button 
      onClick={() => dispatch(asynccreateorder())}
      className="w-full mt-5 cursor-pointer bg-gray-800 text-white hover:bg-black py-3 rounded-full">
        Place Order
      </button>
    </div>)}
  </div>
);
}

export default Cart