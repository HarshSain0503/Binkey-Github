import { useForm } from 'react-hook-form'
import Axios from '../utils/Axios'
import summaryApi from '../common/summaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/axiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'

const AddAddress = ({ close }) => {
    const { register, handleSubmit, reset } = useForm()
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async (data) => {
        try {
            const response = await Axios({
                ...summaryApi.createAddress,
                data: {
                    address_line: data.addressLine,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                    country: data.country,
                    mobile: data.mobile
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                    reset()
                    fetchAddress()
                }
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
    }



    return (
        <section className="bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen  overflow-auto">
            <div className="bg-white p-4 w-full max-w-lg mt-5 mx-auto rounded">
                <div className='flex justify-between items-center gap-4'>
                    <h2 className="font-semibold">Add Address</h2>

                    <button onClick={close} className=' cursor-pointer hover:text-red-600'>
                        <IoClose size={22} />
                    </button>

                </div>

                <form className="mt-4 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-1">
                        <label htmlFor='addressLine'>Address Line:</label>
                        <input
                            type="text"
                            id="addressLine"
                            className="border border-gray-300 bg-blue-50 p-2 rounded"
                            {...register("addressLine", { required: true })}
                        />
                    </div>

                    <div className="grid gap-1">
                        <label htmlFor='city'>City:</label>
                        <input
                            type="text"
                            id="city"
                            className="border border-gray-300 bg-blue-50 p-2 rounded"
                            {...register("city", { required: true })}
                        />
                    </div>

                    <div className="grid gap-1">
                        <label htmlFor='state'>State:</label>
                        <input
                            type="text"
                            id="state"
                            className="border border-gray-300 bg-blue-50 p-2 rounded"
                            {...register("state", { required: true })}
                        />
                    </div>

                    <div className="grid gap-1">
                        <label htmlFor='pincode'>Pin Code:</label>
                        <input
                            type="text"
                            id="pincode"
                            className="border border-gray-300 bg-blue-50 p-2 rounded"
                            {...register("pincode", { required: true })}
                        />
                    </div>

                    <div className="grid gap-1">
                        <label htmlFor='country'>Country:</label>
                        <input
                            type="text"
                            id="country"
                            className="border border-gray-300 bg-blue-50 p-2 rounded"
                            {...register("country", { required: true })}
                        />
                    </div>

                    <div className="grid gap-1">
                        <label htmlFor='mobile'>Mobile No:</label>
                        <input
                            type="text"
                            id="mobile"
                            className="border border-gray-300 bg-blue-50 p-2 rounded"
                            {...register("mobile", { required: true })}
                        />
                    </div>

                    <button type='submit' className=' bg-tertiary-200 hover:bg-yellow-500 mt-3 rounded border border-tertiary-100 w-full py-2 font-semibold'>Submit</button>
                </form>
            </div>
        </section>
    )
}

export default AddAddress