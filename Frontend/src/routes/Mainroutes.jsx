import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/authentication/Login'
import Signup from '../pages/authentication/Signup'
import AddProduct from '../pages/farmer/AddProduct'
import Products from '../pages/Products'
import ProductDetails from '../pages/farmer/ProductDetails'
import MyProducts from '../pages/farmer/MyProducts'
import FarmerOrders from '../pages/farmer/FarmerOrders'
import Cart from '../pages/Cart'
import MyOrders from '../pages/shopkeeper/MyOrder'
import OrderDetail from '../pages/shopkeeper/OrderDetail'
import EditProduct from '../pages/farmer/EditProduct'

const Mainroutes = () => {
  return (
    <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/products' element={<Products />} />
        <Route path='/farmer/addproduct' element={<AddProduct />} />
        <Route path='/farmer/product/:id' element={<ProductDetails/>} />
        <Route path='/farmer/editproduct/:id' element={<EditProduct/>} />
        <Route path='/farmer/dashboard' element={<MyProducts/>} />
        <Route path='/farmer/orders' element={<FarmerOrders/>} />
        <Route path='/cart' element={<Cart/>}  />
        <Route path='/shopkeeper/dashboard' element={<MyOrders />} />
        <Route path='/shopkeeper/orderdetail/:id' element ={<OrderDetail />}  />
        

        
    </Routes>
  )
}

export default Mainroutes