import { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/axiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { setUserDetails } from '../store/userSlice';
import { useDispatch } from 'react-redux';


const Register = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    });
  };

  const validateValue = Object.values(data).every(el => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...summaryApi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message)
      }
      if (response.data.success) {
        toast.success(response.data.message)

        localStorage.setItem('access token', response.data.data.accessToken)
        localStorage.setItem('refresh token', response.data.data.refreshToken)

        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data))

        setData({
          email: '',
          password: '',
        })
        navigate('/')
      }
    }
    catch (error) {
      AxiosToastError(error)
    }
  }


  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-6'>
        <p className="text-lg font-bold text-center text-yellow-500">Login</p>

        <form className='grid gap-5 mt-6' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor='email'>Email_Id :</label>
            <input
              type='email'
              id='email'
              autoFocus
              className='bg-blue-50 p-2 border-2 rounded outline-none focus-within:border-tertiary-200'
              name='email'
              value={data.email}
              onChange={handleChange}
              placeholder='Enter your email_id'
            />
          </div>


          <div className='grid gap-1'>
            <label htmlFor='password'>Password :</label>
            <div className='bg-blue-50 p-2 border-2 rounded flex items-centre focus-within:border-tertiary-200'>
              <input
                type={showPassword ? "text" : "password"}
                id='password'
                autoFocus
                className='w-full outline-none bg-transparent'
                name='password'
                value={data.password}
                onChange={handleChange}
                placeholder='Enter your password'
              />
              <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer'>
                {
                  showPassword ? (
                    <FaRegEye />
                  ) : (
                    <FaRegEyeSlash />
                  )
                }
              </div>
            </div>

            <Link to={'/forgot-password'} className='font-semibold block ml-auto text-green-700 hover:text-green-600'>Forgot Password ?</Link>
          </div>

          <button disabled={!validateValue} className={` ${validateValue ? "bg-green-800 hover:bg-green-600 " : "bg-gray-600"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>
            Login
          </button>

        </form>

        <p  >
          Don&apos;t have an account ? <Link to={`/register`} className='font-semibold text-green-700 hover:text-green-600'>Register</Link></p>
      </div>
    </section>
  )
}

export default Register
