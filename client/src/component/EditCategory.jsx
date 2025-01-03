import { useState } from "react"
import { IoClose } from "react-icons/io5";
import Axios from "../utils/Axios";
import uploadImage from "../utils/UploadImage";
import summaryApi from "../common/summaryApi";
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/axiosToastError';

const EditCategory = ({ close, fetchData, data: CategoryData }) => {
    const [data, setData] = useState({
        _id: CategoryData._id,
        name: CategoryData.name,
        image: CategoryData.image
    })
    const [loading, setLoading] = useState(false)

    const onhandleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.updateCategory,
                data: data
            })
            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                close()
                fetchData()
            } else {
                toast.error(responseData.message || "Failed to update category.");
            }
        }
        catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }
        setLoading(true)

        const response = await uploadImage(file)
        const { data: ImageResponse } = response
        setLoading(false)

        setData((prev) => {
            return {
                ...prev,
                image: ImageResponse.data.url
            }
        })
    }



    return (
        <section className="fixed top-0 left-0 bottom-0 right-0 bg-neutral-800 bg-opacity-60 flex items-center justify-center">
            <div className="bg-white max-w-4xl w-full p-4 rounded">
                <div className="flex items-center justify-between">
                    <h1 className="font-semibold">Edit  Category</h1>
                    <button onClick={close} className="w-fit block ml-auto">
                        <IoClose size={25} />
                    </button>
                </div>

                <form className="my-3 grid gap-6" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <label id="categoryName">Category Name</label>
                        <input
                            type="text"
                            id="categoryName"
                            placeholder="Enter category name"
                            value={data.name}
                            name="name"
                            onChange={onhandleChange}
                            className="bg-blue-50 p-2 border border-blue-100 focus-within:border-tertiary-200 outline-none rounded"
                        />
                    </div>

                    <div className="grid gap-2">
                        <p>Category Image</p>
                        <div className="flex flex-col gap-4 lg:flex-row items-center    ">
                            <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded">
                                {
                                    data.image ? (
                                        <img
                                            src={data.image}
                                            alt="Category Image"
                                            className="w-full h-full object-scale-down"
                                        />
                                    ) : (
                                        <p className="text-sm text-neutral-500">No Image</p>
                                    )
                                }

                            </div>
                            <label htmlFor="uploadCategoryImage">
                                <div className={`
                            ${!data.name ? "bg-gray-300" : "border-tertiary-200 hover:bg-yellow-300 hover:border-tertiary-100"
                                    } px-4 py-2 rounded cursor-pointer border font-medium`
                                }>
                                    {
                                        loading ? "Loading..." : "Upload Image"
                                    }
                                </div>
                                <input
                                    type="file"
                                    disabled={!data.name}
                                    onChange={handleUploadCategoryImage}
                                    id="uploadCategoryImage"
                                    name="image"
                                    accept="image/*"
                                    className="hidden"
                                />
                            </label>

                        </div>
                    </div>

                    <button disabled={loading || (!data.name && data.image)} className={
                        `
                    ${data.name && data.image && !loading ? "bg-tertiary-200 hover:bg-tertiary-200 hover:border-tertiary-100 border" : "bg-gray-300 cursor-not-allowed "
                        } py-2 font-semibold
                    `
                    }>Edit Category</button>
                </form>

            </div>
        </section>
    )
}

export default EditCategory
