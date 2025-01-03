import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Loading from "../component/Loading";
import ViewImage from "../component/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../component/AddFieldComponent";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import AxiosToastError from '../utils/axiosToastError'
import SuccessAlert from "../utils/successAlert";

const UploadProduct = ({ fetchData }) => {
    const [data, setData] = useState({
        name: '',
        image: [],
        category: [],
        subCategory: [],
        unit: [],
        stock: '',
        price: '',
        discount: '',
        description: '',
        more_details: {},
    })

    const [imageLoading, setImageLoading] = useState(false)
    const [viewImageUrl, setViewImageUrl] = useState('')
    const allCategory = useSelector(state => state.product.allCategory)
    const allSubCategory = useSelector(state => state.product.allSubCategory)
    const [selectCategory, setSelectCategory] = useState("")
    const [selectSubCategory, setSelectSubCategory] = useState("")
    const [openAddField, setOpenAddField] = useState(false)
    const [fieldName, setFieldName] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            return
        }

        setImageLoading(true)
        const response = await uploadImage(file)
        const { data: ImageResponse } = response
        const imageurl = ImageResponse.data.url

        setData((prev) => {
            return {
                ...prev,
                image: [...prev.image, imageurl]
            }
        })
        setImageLoading(false)
    }

    const handleDeleteImage = async (index) => {
        data.image.splice(index, 1)
        setData((prev) => {
            return {
                ...prev
            }
        })
    }

    const handleRemoveCategory = async (index) => {
        data.category.splice(index, 1)
        setData((prev) => {
            return {
                ...prev
            }
        })
    }

    const handleRemoveSubCategory = async (index) => {
        data.subCategory.splice(index, 1)
        setData((prev) => {
            return {
                ...prev
            }
        })
    }

    const handleAddField = () => {
        setData((prev) => {
            return {
                ...prev,
                more_details: {
                    ...prev.more_details,
                    [fieldName]: ""
                }
            }
        })

        setFieldName("")
        setOpenAddField(false)
    }

    const handleRemoveField = async (key) => {
        setData((prev) => {
            const updatedDetails = { ...prev.more_details };
            delete updatedDetails[key]; // Remove the field using the key

            return {
                ...prev,
                more_details: updatedDetails
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...summaryApi.createProduct,
                data: data
            })
            const { data: responseData } = response

            if (responseData.success) {
                SuccessAlert(responseData.message)
                setData({
                    name: '',
                    image: [],
                    category: [],
                    subCategory: [],
                    unit: [],
                    stock: '',
                    price: '',
                    discount: '',
                    description: '',
                    more_details: {},
                })
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
    }



    return (
        <section>
            <div className="p-2 bg-white shadow-md flex items-center justify-between">
                <h2 className="font-bold">Upload Product</h2>
            </div>

            <div className="grid p-3">
                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-1">
                        <label htmlFor="name">Product Name</label>
                        <input
                            id='name'
                            type="text"
                            placeholder="Enter product name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            required
                            className="bg-blue-50 p-2 outline-none border focus-within:border-tertiary-200 rounded"
                        />
                    </div>

                    <div className="grid gap-1">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id='description'
                            type="text"
                            placeholder="Enter product description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            multiple
                            rows={3}
                            className="bg-blue-50 p-2 outline-none border focus-within:border-tertiary-200 rounded resize-none"
                        />
                    </div>

                    <div className="grid gap-1">
                        <p>Image</p>
                        <div>
                            <label htmlFor="productImage" className="bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer">
                                <div className="text-centre flex justify-centre items-center flex-col">
                                    {
                                        imageLoading ? <Loading /> : (
                                            <>
                                                <FaCloudUploadAlt size={35} />
                                                <p>Upload Product Image</p>
                                            </>
                                        )
                                    }
                                </div>

                                <input
                                    type="file"
                                    id="productImage"
                                    name="productImage"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleUploadImage}
                                />
                            </label>

                            {/* Displayed Upload Image */}
                            <div className="flex flex-wrap gap-4">
                                {
                                    data.image.map((img, index) => {
                                        return (
                                            <div key={img + index} className="h-20 m-1 w-1/12 min-w-16 bg-blue-50 border relative group rounded">
                                                <img
                                                    src={img}
                                                    alt={img}
                                                    className="w-full h-full object-scale-down cursor-pointer border"
                                                    onClick={() => setViewImageUrl(img)}
                                                />
                                                <div onClick={() => handleDeleteImage(index)} className="absolute bottom-0 right-0 bg-red-500 text-white p-1 rounded-full hover:text-red-800 cursor-pointer hidden group-hover:block">
                                                    <MdDelete fontSize={16} />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-1">
                        <label>Category</label>
                        <div>
                            <select className="bg-blue-50 border w-full p-2 rounded"
                                value={selectCategory}
                                onChange={(e) => {
                                    const value = e.target.value
                                    const category = allCategory.find(el => el._id === value)

                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            category: [...prev.category, category]
                                        }
                                    })
                                    setSelectCategory("")
                                }}
                            >
                                <option value="">Select Category</option>
                                {
                                    allCategory.map((c, index) => {
                                        return (
                                            <option key={c._id} value={c?._id}>{c.name}</option>
                                        )
                                    })
                                }
                            </select>

                            <div className="flex flex-wrap gap-3">
                                {
                                    data.category.map((c, index) => {
                                        return (
                                            <div key={c._id + index + "productsection"} className="text-sm flex items-center gap-1 rounded bg-blue-50 mt-2">
                                                <p>{c.name}</p>
                                                <div className="hover:text-red-500 cursor-pointer" onClick={() => handleRemoveCategory(index)}>
                                                    <IoClose size={20} />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-1">
                        <label>Sub Category</label>
                        <div>
                            <select className="bg-blue-50 border w-full p-2 rounded"
                                value={selectSubCategory}
                                onChange={(e) => {
                                    const value = e.target.value
                                    const subCategory = allSubCategory.find(el => el._id === value)

                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            subCategory: [...prev.subCategory, subCategory]
                                        }
                                    })
                                    setSelectSubCategory("")
                                }}
                            >
                                <option value="">Select Sub Category</option>
                                {
                                    allSubCategory.map((c, index) => {
                                        return (
                                            <option key={c._id} value={c?._id}>{c.name}</option>
                                        )
                                    })
                                }
                            </select>

                            <div className="flex flex-wrap gap-3">
                                {
                                    data.subCategory.map((c, index) => {
                                        return (
                                            <div key={c._id + index + "productsection"} className="text-sm flex items-center gap-1 rounded bg-blue-50 mt-2">
                                                <p>{c.name}</p>
                                                <div className="hover:text-red-500 cursor-pointer" onClick={() => handleRemoveSubCategory(index)}>
                                                    <IoClose size={20} />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-1">
                        <label htmlFor="unit">Unit</label>
                        <input
                            id='unit'
                            type="text"
                            placeholder="Enter product unit"
                            name="unit"
                            value={data.unit}
                            onChange={handleChange}
                            required
                            className="bg-blue-50 p-2 outline-none border focus-within:border-tertiary-200 rounded"
                        />
                    </div>

                    <div className="grid gap-1">
                        <label htmlFor="stock">Number of Stock</label>
                        <input
                            id='stock'
                            type="number"
                            placeholder="Enter product stock"
                            name="stock"
                            value={data.stock}
                            onChange={handleChange}
                            required
                            className="bg-blue-50 p-2 outline-none border focus-within:border-tertiary-200 rounded"
                        />
                    </div>

                    <div className="grid gap-1">
                        <label htmlFor="price">Price</label>
                        <input
                            id='price'
                            type="number"
                            placeholder="Enter product price"
                            name="price"
                            value={data.price}
                            onChange={handleChange}
                            required
                            className="bg-blue-50 p-2 outline-none border focus-within:border-tertiary-200 rounded"
                        />
                    </div>

                    <div className="grid gap-1">
                        <label htmlFor="discount">Discount</label>
                        <input
                            id='discount'
                            type="number"
                            placeholder="Enter product discount"
                            name="discount"
                            value={data.discount} 
                            onChange={handleChange}
                            required
                            className="bg-blue-50 p-2 outline-none border focus-within:border-tertiary-200 rounded"
                        />
                    </div>


                    {/* Add More Fields */}

                    {
                        Object?.keys(data?.more_details)?.map((k, index) => {
                            return (
                                <div className="grid gap-1 group relative" key={index}>
                                    <label htmlFor={k}>{k}</label>
                                    <input
                                        id={k}
                                        type="text"
                                        placeholder={`Enter ${k}`}
                                        value={data?.more_details[k]}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    more_details: {
                                                        ...prev.more_details,
                                                        [k]: value
                                                    }
                                                }
                                            })
                                        }}
                                        required
                                        className="bg-blue-50 p-2 outline-none border focus-within:border-tertiary-200 rounded"
                                    />
                                    <div onClick={() => handleRemoveField(k)} className="absolute bottom-0 right-0 bg-red-500 text-white p-1 rounded-full hover:text-red-800 cursor-pointer hidden group-hover:block">
                                        <MdDelete fontSize={18} />
                                    </div>
                                </div>
                            )
                        })
                    }

                    <div onClick={() => setOpenAddField(true)} className="hover:bg-tertiary-200 bg-white border border-tertiary-200 hover:border-tertiary-100  mt-2 py-1 px-3 w-40 rounded text-center font-semibold cursor-pointer">
                        Add More Fields
                    </div>

                    <button className="bg-tertiary-200 border hover:border-tertiary-100 py-2 rounded font-semibold">
                        Submit
                    </button>
                </form>
            </div>

            {
                viewImageUrl && (
                    <ViewImage url={viewImageUrl} close={() => setViewImageUrl("")} />
                )
            }

            {
                openAddField && (
                    <AddFieldComponent value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        submit={handleAddField}
                        close={() => setOpenAddField(false)}
                    />
                )
            }
        </section>
    )
}

export default UploadProduct
