import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './component/Header'
import Footer from './component/footer'
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { useDispatch } from 'react-redux';
import summaryApi from './common/summaryApi';
import Axios from './utils/Axios';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice';
import GlobalProvider from './provider/GlobalProvider.jsx';
import CartMobile from './component/CartMobile.jsx';

function App() {
  const dispatch = useDispatch()

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data));
  }

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({
        ...summaryApi.getCategory
      })
      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data))
      }
    }
    catch (error) {
      console.log(error)
      alert("Error fetching category")
    }
    finally {
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...summaryApi.getSubCategory
      })
      const { data: responseData } = response

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data))
      }
    }
    catch (error) {
      console.log(error)
      alert("Error fetching category")
    }
  }

  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
  }, [])

  return (
    <GlobalProvider>
      <Header />

      <main className='min-h-[78vh]'>
        <Outlet />
      </main>

      <Footer />
      <Toaster />
      <CartMobile />
    </GlobalProvider>
  )
}

export default App
