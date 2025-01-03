import { useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/axiosToastError';
import { Link, useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
  const [data, setData] = useState({
    email: '',
  })

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const validateValue = Object.values(data).every(el => el);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await Axios({
        ...summaryApi.forgot_password,
        data: data
      })

      if (response.data.error) {
        toast.error(response.data.message)
      }
      if (response.data.success) {
        toast.success(response.data.message)
        
        navigate('/verification-otp', {
            state: data
        })

        setData({
          email: '',
        })
      }
    }
    catch (error) {
      AxiosToastError(error)
    }
  }


  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-6'>
        <p className="text-lg font-bold text-center text-yellow-500">Forgot-Password</p>

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

          <button disabled={!validateValue} className={` ${validateValue ? "bg-green-800 hover:bg-green-600 " : "bg-gray-600"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>
            Send OTP
          </button>

        </form>

        <p  >
          Already have an account ? <Link to={`/login`} className='font-semibold text-green-700 hover:text-green-600'>Login</Link></p>
      </div>
    </section>
  )
}

export default ForgotPassword

