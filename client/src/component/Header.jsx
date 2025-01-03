import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import Search from './Search';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { GrCart } from "react-icons/gr";
import { useDispatch, useSelector } from 'react-redux';
import { RxTriangleUp, RxTriangleDown } from "react-icons/rx";
import UserMenu from './Usermenu';
import DisplayRupees from '../utils/DisplayRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import { handleAdditemCart } from '../store/cartProduct';
import AxiosToastError from '../utils/axiosToastError';


const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search'
  const navigate = useNavigate()
  const user = useSelector((state) => state?.user)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const cartItem = useSelector((state) => state?.cartItem?.cart)
  const { totalPrice, totalQty } = useGlobalContext()
  const [openCart, setOpenCart] = useState(false)
  const dispatch = useDispatch()


  const redirectToLoginPage = () => {
    navigate('/login')
  }

  const handleCloseUserMenu = () => {
    setOpenCart(false)
    setOpenUserMenu(false)
  }

  const handleMobileUser = () => {
    if (!user._id) {
      navigate('/login')
      return
    }

    navigate('/user')
  }

  const fetchCartData = async () => {
    try {
      if (user?._id) {
        const response = await Axios({
          ...summaryApi.getCartItem,
        })

        const { data: responseData } = response
        if (responseData.success) {
          dispatch(handleAdditemCart(responseData.data))
        }
      }
    }
    catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchCartData()
    }
    else {
      dispatch(handleAdditemCart([]))
    }
  }, [user])



  return (
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white'>

      {
        !(isSearchPage && isMobile) && (
          <div className='container mx-auto flex items-center px-1 justify-between'>
            {/**Logo */}
            <div className='h-full'>
              <Link to={"/"} className='h-full flex justify-center items-center'>
                <img src={logo} width={170} height={60} alt='logo' className='hidden lg:block' />
                <img src={logo} width={120} height={60} alt='logo' className='lg:hidden' />
              </Link>
            </div>


            {/**Search */}
            <div className='hidden lg:block'>
              <Search />
            </div>


            {/**Login and My Cart */}
            <div>
              {/* User icons display in only mobile version */}
              <button onClick={handleMobileUser} className='text-neutral-600 lg:hidden'>
                <FaRegCircleUser size={24} />
              </button>


              {/* Desktop */}
              <div className='hidden lg:flex items-center gap-10'>
                {
                  user?._id ? (
                    <div className='relative'>
                      <div onClick={() => setOpenUserMenu(prev => !prev)} className='flex select-none items-center gap-2 cursor-pointer'>
                        <p className='text-medium font-semibold'>Account</p>

                        {
                          openUserMenu ? (<RxTriangleUp size={25} />) : (<RxTriangleDown size={25} />)
                        }
                      </div>

                      {
                        openUserMenu && (
                          <div className='absolute right-0 top-12'>
                            <div className='bg-white rounded p-4 min-w-52 lg:shadow-lg'>
                              <UserMenu close={handleCloseUserMenu} />
                            </div>
                          </div>
                        )
                      }

                    </div>
                  ) : (
                    <button onClick={redirectToLoginPage} className='text-lg px-2'>
                      Login
                    </button>
                  )
                }

                <button onClick={() => setOpenCart(true)} className='flex items-center gap-2 bg-green-700 hover:bg-green-600 px-3 py-2 rounded text-white'>
                  {/* Add to cart icon */}
                  <div className='animate-bounce mt-1'>
                    <GrCart size={24} />
                  </div>

                  <div className='font-semibold text-sm'>
                    {
                      cartItem[0] ? (
                        <div>
                          <p>{totalQty} Items</p>
                          <p>{DisplayRupees(totalPrice)}</p>
                        </div>
                      ) : (
                        <p>My Cart</p>
                      )
                    }
                  </div>
                </button>
              </div>
            </div>
          </div>
        )
      }


      <div className='container mx-auto px-2 lg:hidden'>
        <Search />
      </div>

      {
        openCart && (
          <DisplayCartItem close={() => setOpenCart(false)} />
        )
      }
    </header>
  )
}

export default Header
