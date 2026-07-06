import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form";
import { asyncgetproductbyid } from "../../store/actions/productActions";
import { useParams } from "react-router-dom";
import  { asyncupdateproduct } from "../../store/actions/productActions";
import { useEffect } from "react";


const EditProduct = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const products = useSelector((state) => state.products.data);

  const product = products?.find((p) => p._id === id);

  useEffect(() => {
  
      if(!product )
        dispatch(asyncgetproductbyid(id));
  
    }, [id,product,dispatch])


  const { register, handleSubmit } = useForm({defaultValues: {
      
      title: product?.title || "",
      category: product?.category || "",
      description: product?.description || "",
      quantity: product?.quantity || "",
      image: product?.image?.url || "",
      price: product?.price?.amount || "",
      harvestDate: product?.harvestDate?.split("T")[0] || "",
      expiryDate: product?.expiryDate?.split("T")[0] || ""
  }});

  const UpdateProduct= (details) => {
         
     dispatch(asyncupdateproduct(product._id,details));

  }


  return (
    <div className="container mx-auto  p-4">
     
    
    <h2 className="text-3xl lg:text-5xl text-center font-poppins font-semibold my-10 text-[#333]">
      Product Details
    </h2>

      <form  onSubmit={handleSubmit(UpdateProduct)} className="grid grid-cols-1 gap-6">
        <div className="p-2">
          <input
            type="text"
            placeholder="Product Title"
            {...register("title")}
            className="block w-full rounded-md border  border-gray-300 bg-[#f6f6f6] p-2 shadow-sm focus:outline-0 focus:ring-2 focus:border-blue-600  focus:ring-blue-600"
          />
        </div>

        <div className="p-2">
          <input
            type="text"
            placeholder="Product Category"
            {...register("category")}
            className="block w-full rounded-md border  border-gray-300 bg-[#f6f6f6] p-2 shadow-sm focus:outline-0 focus:ring-2 focus:border-blue-600  focus:ring-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 p-2 md:grid-cols-2">
          <div>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Product Description"
              className="block h-48 w-full rounded-md border border-gray-300 bg-[#f6f6f6] p-2 shadow-sm focus:outline-0 focus:ring-2 focus:border-blue-600  focus:ring-blue-600"
            />
          </div>
         <div>
          <label>
            <div className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-[#f6f6f6] hover:bg-gray-50">
              <div className="text-center">
                <div className="mb-2">
                  <span
                    type="button"
                    className="rounded-full cursor-pointer bg-[#333] px-4 py-2 text-white hover:bg-black"
                    >
                     {"Select from the computer"}
                  </span>
                </div>

              
                <p className="mt-1 text-sm text-gray-500">
                  PNG, JPG
                </p>
              </div>
            </div>

            <input
           {...register("image")}
           type="file"
           accept="image/*"
           className="hidden"
           />
          </label>
           </div>
        </div>

        <div className="p-2">
          <input
            type="number"
            min="0"
            step="any"
             {...register("price")}
            placeholder="Price per Kg"
            className="block w-full no-spinner rounded-md border border-gray-300 bg-[#f6f6f6] p-2 shadow-sm focus:outline-0 focus:ring-2 focus:border-blue-600  focus:ring-blue-600"
          />
        </div>

       
        
        <div className="p-2">
          <input
            type="number"
            min="0.1"
            step="any"
            {...register("quantity")}
            placeholder="Quantity in kg"
            className="block w-full rounded-md border border-gray-300 bg-[#f6f6f6] p-2 shadow-sm focus:outline-0 focus:ring-2 focus:border-blue-600  focus:ring-blue-600"
          />
        </div>

        
        <div className="grid grid-cols-1 gap-6 p-2 md:grid-cols-2">

 
  <div className="flex flex-col gap-1">
    <span className="text-md text-gray-600">Harvest Date</span>
    <input
      type="date"
      {...register("harvestDate")}
      className="w-full rounded-md border border-gray-300 bg-[#f6f6f6] p-2 shadow-sm focus:outline-none focus:ring-2 focus:border-blue-600 focus:ring-blue-600"
    />
  </div>

  <div className="flex flex-col gap-1">
    <span className="text-md text-gray-600">Expiry Date</span>
    <input
      type="date"
      {...register("expiryDate")}
      className="w-full rounded-md border border-gray-300 bg-[#f6f6f6] p-2 shadow-sm focus:outline-none focus:ring-2 focus:border-blue-600 focus:ring-blue-600"
    />
  </div>
 

</div>

        

        <div className="mt-6 p-2">
          <button
            type="submit"
            className="block cursor-pointer w-full rounded-full bg-[#333] px-4 py-3 font-bold text-white hover:bg-black"
          >
            Edit Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct