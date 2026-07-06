import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { asyncacceptorder, asyncgetmetrics, asyncgetsellerorders, asyncrejectorder } from "../../store/actions/sellerAction";






const FarmerOrder  = () =>  {

   const dispatch = useDispatch()


   const acceptOrder = async (orderId) => {

     console.log("Hello");
     await dispatch(asyncacceptorder(orderId));
     dispatch(asyncgetmetrics());
     dispatch(asyncgetsellerorders());
   }

   const rejectOrder = async (orderId) => {
      await dispatch(asyncrejectorder(orderId));
      dispatch(asyncgetmetrics());
      dispatch(asyncgetsellerorders());
   }

   useEffect(()=> {
         dispatch(asyncgetmetrics());
         dispatch(asyncgetsellerorders());
   },[]);

   
    const orders = useSelector((state) => state.seller.data)
    const metrics = useSelector((state) => state.seller.metrics)

    
    const stats = [
  { label: "Total Sales", value: metrics?.totalSales },
  { label: "Top Product", value: (metrics?.topProduct || "🍅"  )},
    ];



  return (
    <div className="px-6 mt-4 gap-10 bg-white flex flex-col items-center">
      {/* Stats */}
      <div className="flex flex-wrap items-center justify-center max-w-7xl mx-auto px-6 py-12 gap-10">
        {stats.map((item) => (
          <div
          key={item.label}
          className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-6 w-75"
          >
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className="text-3xl font-semibold text-slate-800 mt-2">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div> 
      <div className="bg-white w-7xl rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b bg-indigo-50 flex justify-between items-center">
          <p className="text-sm text-slate-600">Order Matrix</p>
          <span className="text-xs text-slate-500">
            {orders.length} Orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-8 py-4 text-left">Id</th>
                <th className="px-8 py-4 text-left">Amount</th>
                <th className="px-8 py-4 text-left">Order Date</th>
                <th className="px-8 py-4 text-left">Status</th>
                <th className="px-8 py-4 text-right">
                  Accept / Reject Order
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr
                key={order?._id}
                className="hover:bg-indigo-50 transition"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">

                      <div>
                        <p className="font-medium text-slate-800">
                          {order?._id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-slate-600">
                    {order?.totalPrice.amount}
                  </td>

                  <td className="px-8 py-6 text-slate-600">
                    {order?.createdAt.split("T")[0].split("-").reverse().join("-")}
                  </td>

                  <td className="px-8 py-6">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium uppercase`}
                      >
                      {order?.status}
                    </span>
                  </td>

                  <td className="px-8 py-6">
                    {order?.status === "pending" && (<div className="flex justify-end gap-3">
                      <button 
                        onClick={() => acceptOrder(order?._id)}
                        className="px-3 py-1 cursor-pointer  text-xs bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200">
                        Accept
                      </button>

                      <button 
                        onClick={() => rejectOrder(order?._id)}
                        className="px-3 py-1 text-xs cursor-pointer bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200">
                        Reject
                      </button>
                    </div>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
         <div className="mt-6 px-6 flex justify-between items-center text-sm text-slate-500">
        <span>Showing {orders.length} orders</span>
        </div>
         </div>
      </div>

     
  );
}

export default FarmerOrder;