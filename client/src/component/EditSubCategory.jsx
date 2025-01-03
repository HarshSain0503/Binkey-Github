import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import uploadImage from '../utils/UploadImage'
import { useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import summaryApi from '../common/summaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/axiosToastError'

const EditSubCategory = ({ close, data, fetchData }) => {
    const [subCategoryData, setSubcategoryData] = useState({
        _id : data._id,
        name: data.name,
        image: data.image,
        category: data.category || []
    })

    const allCategory = useSelector(state => state.product.allCategory)

    const handleChange = (e) => {
        const { name, value } = e.target

        setSubcategoryData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }

        const response = await uploadImage(file)
        const { data: ImageResponse } = response

        setSubcategoryData((prev) => {
            return {
                ...prev,
                image: ImageResponse.data.url
            }
        })
    }

    const handleRemoveCategorySelected = async (categoryId) => {
        const index = subCategoryData.category.find(el => el._id === categoryId)
        subCategoryData.category.splice(index, 1)
        setSubcategoryData((prev) => {
            return {
                ...prev
            }
        })
    }

    const handleSubmitSubCategory = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios({
                ...summaryApi.updateSubCategory,
                data: subCategoryData
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                }
                if(fetchData){
                    fetchData()
                }
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
    }



    return (
        <section className="fixed top-0 right-0 left-0 bottom-0 bg-neutral-800 bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-5xl bg-white p-4 rounded">
                <div className='flex items-center justify-between gap-3'>
                    <h1 className='font-semibold'>Edit Sub category</h1>
                    <button onClick={close}>
                        <IoClose size={25} />
                    </button>
                </div>

                <form className='my-3 grid gap-6' onSubmit={handleSubmitSubCategory}>
                    <div className='grid gap-2'>
                        <label htmlFor='name'>Sub Category Name</label>
                        <input className='p-3 bg-blue-50 border outline-none focus-within:border-tertiary-200 rounded'
                            id='name'
                            type='text'
                            name='name'
                            value={subCategoryData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='grid gap-2'>
                        <p>Sub Category Image</p>
                        <div className='flex flex-col lg:flex-row items-center gap-3'>
                            <div className='border lg:w-36 w-full h-36 bg-blue-50 flex justify-center items-center'>
                                {
                                    !subCategoryData.image ? (
                                        <p className='text-sm text-neutral-400'>No Image</p>
                                    ) : (
                                        <img
                                            src={subCategoryData.image}
                                            alt="Sub Category Image"
                                            className="w-full h-full object-scale-down"
                                        />
                                    )
                                }
                            </div>

                            <label htmlFor='uploadSubCategoryImage'>
                                <div className='px-4 py-1 border border-tertiary-200 rounded hover:bg-tertiary-200 hover:border-tertiary-100 hover:text-neutral-900 cursor-pointer'>
                                    Upload Image
                                </div>
                                <input
                                    type='file'
                                    id='uploadSubCategoryImage'
                                    name='uploadSubCategoryImage'
                                    onChange={handleUploadSubCategoryImage}
                                    className='hidden'
                                />
                            </label>
                        </div>
                    </div>


                    <div className='grid gap-2'>
                        <label>Select Category</label>
                        <div className='border focus-within:border-tertiary-200 rounded'>
                            {/* display value */}
                            <div className='flex flex-wrap gap-2'>
                                {
                                    subCategoryData.category.map((cat, index) => {
                                        return (
                                            <p key={cat._id + "selectedvalue"} className='bg-white shadow-md px-1 m-1 flex items-center gap-2'>{cat.name}
                                                <div className='cursor-pointer hover:text-red-600' onClick={() => handleRemoveCategorySelected(cat._id)}>
                                                    <IoClose size={18} />
                                                </div>
                                            </p>
                                        )
                                    })
                                }
                            </div>


                            {/* select category */}
                            <select className='w-full bg-transparent p-2 outline-none border'
                                onChange={(e) => {
                                    const value = e.target.value
                                    const categoryDetails = allCategory.find(el => el._id == value)

                                    setSubcategoryData((prev) => {
                                        return {
                                            ...prev,
                                            category: [...prev.category, categoryDetails]
                                        }
                                    })
                                }}>
                                <option value={""}>Select Category</option>
                                {
                                    allCategory.map((category, index) => {
                                        return (
                                            <option value={category?._id} key={category._id + "subcategory"}>{category.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>

                    <button className={`px-4 py-1 border rounded
                     ${subCategoryData.name && subCategoryData.image && subCategoryData.category[0] ? "bg-tertiary-200 hover:border-tertiary-100" : "bg-gray-200"}
                      font-semibold`}>
                        Edit SubCategory
                    </button>
                </form>
            </div>
        </section>
    )
}


export default EditSubCategory