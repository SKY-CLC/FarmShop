import React from 'react'
import Login from './pages/authentication/Login'
import Home from './pages/Home'
import Mainroutes from './routes/Mainroutes'
import Navbar from './components/common/Navbar'
import { useEffect } from 'react'
import { asyncgetuser } from './store/actions/userActions'
import { useDispatch } from 'react-redux'


const App = () => {

  const dispatch = useDispatch()

 
  useEffect(()=> {
      dispatch(asyncgetuser());
  },[]);

  

  return (
    <div className=' bg-white ' > 
          <Navbar />
          <Mainroutes />
    </div>
  )
}

export default App