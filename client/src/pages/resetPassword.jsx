import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import AxiosToastError from '../utils/axiosToastError';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import summaryApi from '../common/summaryApi';

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const validateValue = Object.values(data).every(el => el);

    useEffect(() => {
        if (!(location?.state?.data?.success)) {
            navigate('/')
        }

        if (location?.state?.email) {
            setData((prev) => {
                return {
                    ...prev,
                    email: location?.state?.email
                }
            })
        }
    }, [location, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(data.newPassword !== data.confirmPassword){
            toast.error('New password and Confirm Password must be the same')
            return
        }

        try {
            const response = await Axios({
                ...summaryApi.reset_password,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }
            if (response.data.success) {
                toast.success(response.data.message)

                navigate('/login')

                setData({
                    email: '',
                    newPassword: '',
                    confirmPassword: ''
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
                <p className="text-lg font-bold text-center text-yellow-500">Reset-Password</p>

                <form className='grid gap-5 mt-6' onSubmit={handleSubmit}>

                    <div className='grid gap-1'>
                        <label htmlFor='newPassword'>New Password :</label>
                        <div className='bg-blue-50 p-2 border-2 rounded flex items-centre focus-within:border-tertiary-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='newPassword'
                                autoFocus
                                className='w-full outline-none bg-transparent'
                                name='newPassword'
                                value={data.newPassword}
                                onChange={handleChange}
                                placeholder='Enter your new password'
                            />
                            <div onClick={() => setShowPassword((prev) => !prev)} className='cursor-pointer'>
                                {
                                    showPassword ? <FaRegEye /> :<FaRegEyeSlash />
                                }
                            </div>
                        </div>
                    </div>


                    <div className='grid gap-1'>
                        <label htmlFor='confirmPassword'>Confirm-Password :</label>
                        <div className='bg-blue-50 p-2 border-2 rounded flex items-centre focus-within:border-tertiary-200'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                autoFocus
                                className='w-full outline-none bg-transparent'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Enter your confirm password'
                            />
                            <div onClick={() => setShowConfirmPassword((prev) => !prev)} className='cursor-pointer'>
                                {
                                    showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />
                                }
                            </div>
                        </div>
                    </div>

                    <button disabled={!validateValue} className={` ${validateValue ? "bg-green-800 hover:bg-green-600 " : "bg-gray-600"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                        Change Password
                    </button>

                </form>

                <p  >
                    Already have an account ? <Link to={`/login`} className='font-semibold text-green-700 hover:text-green-600'>Login</Link></p>
            </div>
        </section>
    )
}

export default ResetPassword;
