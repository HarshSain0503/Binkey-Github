import { useState } from "react"
import EditProductAdmin from "../component/EditProductAdmin"
import { IoClose } from "react-icons/io5"
import Axios from '../utils/Axios'
import summaryApi from '../common/summaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/axiosToastError'

const ProductCardAdmin = ({ data, fetchProductData }) => {
    const [editOpen, setEditOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const handleDeleteCancel = async () => {
        setOpenDelete(false)
    }

    const handleDelete = async () => {
        try {
            const response = await Axios({
                ...summaryApi.deleteProductDetails,
                data: {
                    _id : data._id
                }
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                if(fetchProductData){
                    fetchProductData()
                }
                setOpenDelete(false)
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
    }



    return (
        <div className="w-36 p-4 py-5 shadow-md shadow-slate-300 rounded">
            <div>
                <img
                    src={data?.image[0]}
                    alt={data?.name}
                    className="w-full h-full object-scale-down"
                />
            </div>
            <p className="font-medium text-ellipsis line-clamp-1 mt-3">{data?.name}</p>
            <p className="text-slate-400 text-ellipsis line-clamp-1">{data?.unit}</p>

            <div className="grid grid-cols-2 gap-5 py-3">
                <button onClick={() => {
                    setEditOpen(true)
                }}
                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium rounded">
                    Edit
                </button>
                <button onClick={() => {
                    setOpenDelete(true)
                }} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium rounded">
                    Delete
                </button>
            </div>

            {
                editOpen && (
                    <EditProductAdmin fetchProductData={fetchProductData} data={data} close={() => setEditOpen(false)} />
                )
            }

            {
                openDelete && (
                    <section className="fixed top-0 right-0 left-0 bottom-0 bg-neutral-600 z-50 bg-opacity-70 p-4 flex items-center justify-center">
                        <div className="bg-white p-4 w-full max-w-md rounded">
                            <div className="flex items-center justify-between gap-4">
                                <h3 className="font-semibold">Permanent Delete</h3>
                                <button onClick={() => setOpenDelete(false)}>
                                    <IoClose size={25} />
                                </button>
                            </div>
                            <p className="my-2">Are you sure to delete permanent</p>
                            <div className="flex justify-end gap-5 py-4">
                                <button onClick={handleDeleteCancel} className="border px-3 py-1 rounded border-red-600 hover:bg-red-600 text-red-600 hover:text-white font-medium">Cancel</button>
                                <button onClick={handleDelete} className="border px-3 py-1 rounded border-green-600 hover:bg-green-600 text-green-600 hover:text-white font-medium">Delete</button>
                            </div>
                        </div>
                    </section>
                )
            }

        </div>
    )
}

export default ProductCardAdmin