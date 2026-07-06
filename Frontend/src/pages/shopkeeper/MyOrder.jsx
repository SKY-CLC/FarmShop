import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { asyncgetorders } from "../../store/actions/orderActions";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/common/Footer";


const MyOrders = () => {
  
  const statusMap = {
  pending: { label: "pending", dot: "bg-amber-400", pill: "bg-amber-50 text-amber-700 border border-amber-200" },
  accepted: { label: "accepted",   dot: "bg-green-500", pill: "bg-green-50 text-green-700 border border-green-200" },
  rejected: { label: "rejected",   dot: "bg-red-400",   pill: "bg-red-50 text-red-600 border border-red-200" },
  cancelled: { label: "cancelled",   dot: "bg-blue-400",   pill: "bg-blue-50 text-blue-600 border border-blue-200" },
};

const dispatch  = useDispatch();
const navigate = useNavigate();

 useEffect(()=> {
    dispatch(asyncgetorders());
 },[])

 const orders = useSelector((state) => state.orders.data);
 const stats = useSelector((state) => state.orders.stats);

 const st = [
              { label: "Total orders", value: (stats?.pending || 0) + (stats?.accepted || 0) + (stats?.rejected || 0) + (stats?.cancelled || 0), c: "text-gray-600" },
              { label: "Pending", value: (stats?.pending || 0), c: "text-amber-600" },
              { label: "Accepted", value: (stats?.accepted || 0), c: "text-green-600" },
              { label: "Rejected", value: (stats?.rejected || 0), c: "text-red-500" },
              { label: "Cancelled", value: (stats?.cancelled || 0), c: "text-blue-500" },
            ]

 



  return (
  

    <div className="flex  bg-white text-gray-900 overflow-hidden font-sans">

      

      

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 bg-white">

         

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-7">
            {st.map((s) => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                <p className={`text-xs ${s.c}  mb-1`}>{s.label}</p>
                <p className="text-3xl font-semibold text-gray-900 leading-tight">{s.value}</p>
               
              </div>
            ))}
          </div>

          


          

          {/* Order cards */}
          <div className="flex flex-col gap-3 pb-6">
            {orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">📦</p>
                <p className="text-sm">No orders found</p>
              </div>
            ) : (
              orders.map((order) => {
                const s = statusMap[order.status];
                return (
                  <div
                  key={order._id}
                  onClick={()=> navigate(`/shopkeeper/orderdetail/${order._id}`)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center shadow-sm gap-4 cursor-pointer hover:border-gray-300 transition-all group"
                  >
                    {/* Thumb */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden">
                    <img
                    src = {order.products[0].thumbnail}
                    alt = "🌱"
                    className='h-full w-full object-cover '/>
                    </div>
                     
                      
                 

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${s?.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s?.dot}`} />
                          {s?.label}
                        </span>
                        <span className="text-xs text-gray-400">{order?.createdAt?.split("T")[0].split("-").reverse().join("-")}</span>
                      </div>
                      <p className="text-xs font-semibold text-green-600 mb-0.5">Order ID: {order?._id}</p>
                     
                      <p className="text-base font-semibold text-gray-900 mt-1">Price: ₹{order?.totalPrice?.amount}</p>
                    </div>

                    {/* Arrow */}
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                );
              })
            )}
          </div>

        </main>
      </div>
      </div>
      
      
  
  );
}
export default MyOrders;