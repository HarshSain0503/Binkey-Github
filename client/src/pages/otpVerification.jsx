import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/axiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const OtpVerification = () => {
    const [data, setData] = useState(['', '', '', '', '', ''])
    const navigate = useNavigate();
    const inputRef = useRef([])
    const location = useLocation()

    useEffect(() => {
        if(!location?.state?.email){
            navigate('/forgot-password')
        }
    }, [location, navigate]);   

    const validateValue = data.every(el => el);

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios({
                ...summaryApi.verification_otp,
                data: {
                    otp: data.join(''),
                    email: location?.state?.email
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }
            if (response.data.success) {
                toast.success(response.data.message)
                
                setData(['', '', '', '', '', ''])

                navigate('/reset-password',{
                    state : {
                        data : response.data,
                        email : location?.state?.email
                    },
                });
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
    }


    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-6'>
                <p className="text-lg font-bold text-center text-yellow-500">OTP-Verification</p>

                <form className='grid gap-5 mt-6' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='email'>Enter your OTP :</label>

                        <div className='flex items-centre gap-2 justify-between mt-3'>
                            {
                                data.map((element, index) => {
                                    return (
                                        <input
                                            key={"otp" + index}
                                            type='text'
                                            id='otp'
                                            ref={(ref) =>{
                                                inputRef.current[index] = ref
                                                return ref
                                            }}
                                            value={data[index]}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                console.log('Value', value);

                                                const newData = [...data]
                                                newData[index] = value
                                                setData(newData)

                                                if(value && index < 5){
                                                    inputRef.current[index + 1].focus()
                                                }
                                            }}
                                            maxLength={1}
                                            // autoFocus
                                            className='bg-blue-50 w-full max-w-16 p-2 border-2 rounded outline-none
                                            focus-within:border-tertiary-200 text-center font-semibold'
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>

                    <button disabled={!validateValue} className={` ${validateValue ? "bg-green-800 hover:bg-green-600 " : "bg-gray-600"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                        Verify OTP
                    </button>

                </form>

                <p  >
                    Don&apos;t get OTP ? <Link to={`/forgot-password`} className='font-semibold text-green-700 hover:text-green-600'>Forgot Password</Link></p>
            </div>
        </section>
    )
}

export default OtpVerification

