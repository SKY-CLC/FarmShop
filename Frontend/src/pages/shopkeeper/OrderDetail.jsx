import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { asyncgetorderbyid, asyncdeleteorder } from "../../store/actions/orderActions";
 


const OrderDetail = () => {
   
  const dispatch = useDispatch();
   const orders = useSelector((state) => state.orders.data);
   const user = useSelector((state) => state.users.data)

   const { id } = useParams();

   const order = orders?.find((o)=> o._id === id );

   useEffect(()=>{

    if(!order)
      dispatch(asyncgetorderbyid(id));


   },[id,order,dispatch])

   


  return (
    <div className="py-14 px-4 md:px-6 ">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-semibold">Order Id: {order?._id}</h1>
        <p className="text-gray-600">{order?.createdAt.split("T")[0]
                                          .split("-").reverse().join("-")
          }</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">

        {/* LEFT */}
        <div className="flex-1 space-y-6">

          {/* CART ITEMS */}
          <div className="bg-gray-50 p-6 space-y-6">
            <h2 className="text-xl font-semibold">Product List</h2>

            {order?.products?.map((o) => (
              <div key={o?._id} className="flex gap-6 border-b pb-6">

                <img
                  src={o?.thumbnail}
                  className="w-40 center rounded-md"
                  alt="🌱"
                />
                <div className="w-full">
               <h3 className="text-lg font-semibold">{o?.title}</h3>
                <div className="flex justify-between w-full">
                   
                  <div>
                   

                    <p className="text-sm text-gray-600">
                      Price
                    </p>
                   
                    <p className="text-sm text-gray-600">Quantity</p>
                  </div>

                  <div className="text-right">
                    <p>
                      ₹{o?.price.amount}
                    </p>
          
                    <p className="font-semibold">{o?.quantity}</p>
                  </div>
                </div>
            </div>
                </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="bg-gray-50 p-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>

            <div className="space-y-3 border-b pb-4">
              <div  className="flex justify-between">
                  <p>Status</p>
                  <p className="uppercase ">{order?.status}</p>
                </div>
            </div>

            <div className="flex justify-between font-semibold mt-4">
              <p>Total Price</p>
              <p> ₹{order?.totalPrice.amount}</p>
            </div>
          </div>
        </div>

        {/* RIGHT - CUSTOMER */}
        <div className="w-full xl:w-96 bg-gray-50 p-6 space-y-6">
          <h2 className="text-xl font-semibold">Customer</h2>

          <div className="border-b pb-4">
            <p className="font-semibold">{user?.username}</p>
           <p className="text-sm mt-2">{user?.email}</p>
          </div>

          

          {order?.status === "pending" && ( <button 
          onClick={()=> dispatch(asyncdeleteorder(id))}
          className="w-full cursor-pointer bg-gray-800 text-white hover:bg-black py-3 mt-4">
           Cancel Order
          </button>)}
        </div>
      </div>
    </div>
  );
}


export default OrderDetail;