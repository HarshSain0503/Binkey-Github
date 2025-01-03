import { useEffect, useState } from "react"
import UploadCategoryModel from "../component/UploadCategoryModel"
import Loading from "../component/Loading"
import NoData from "../component/NoData"
import Axios from "../utils/Axios"
import summaryApi from "../common/summaryApi"
import EditCategory from "../component/EditCategory"
import ConfirmBox from "../component/ConfirmBox"
import toast from "react-hot-toast"
import AxiosToastError from "../utils/axiosToastError"
import { useSelector } from "react-redux"

const Category = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({
        name: "",
        image: "",
    })
    const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory, setDeleteCategory] = useState({
        _id: ""
    })
    const allCategory = useSelector(state => state.product.allCategory)

    useEffect(() => {
        setCategoryData(allCategory)
    },[allCategory])


    const fetchCategory = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.getCategory
            })
            const { data: responseData } = response

            if (responseData.success) {
                setCategoryData(responseData.data)
            }
        }
        catch (error) {
            console.log(error)
            alert("Error fetching category")
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    const handleDeleteCataegory = async () => {
        try {
            const response = await Axios({
                ...summaryApi.deleteCategory,
                data: deleteCategory
            })
            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
    }


    return (
        <section>
            <div className="p-2 bg-white shadow-md flex items-center justify-between">
                <h2 className="font-bold">Category</h2>
                <button onClick={() => setOpenUploadCategory(true)} className="text-sm font-semibold border border-tertiary-200 hover:border-tertiary-100
                hover:bg-tertiary-200 px-3 py-1 rounded">Add Category</button>
            </div>

            {
                !categoryData[0] && !loading && (
                    <NoData />
                )
            }

            <div className="p-2 py-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 ml-3">
                {
                    categoryData.map((category, index) => {
                        return (
                            <div key={category._id || index} className="w-32 h-56 rounded shadow-md">
                                <img src={category.image} alt={category.name} className="w-full object-scale-down" />

                                <div className="flex items-center h-9 gap-2">
                                    <button onClick={() => {
                                        setOpenEdit(true)
                                        setEditData(category)
                                    }}
                                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium rounded">
                                        Edit
                                    </button>
                                    <button onClick={() => {
                                        setOpenConfirmBoxDelete(true)
                                        setDeleteCategory(category)
                                    }} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium rounded">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {
                loading && (
                    <Loading />
                )
            }

            {
                openUploadCategory && (
                    <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
                )
            }

            {
                openEdit && (
                    <EditCategory data={editData} fetchData={fetchCategory} close={() => setOpenEdit(false)} />
                )
            }
            {
                openConfirmBoxDelete && (
                    <ConfirmBox
                        close={() => setOpenConfirmBoxDelete(false)}
                        cancel={() => setOpenConfirmBoxDelete(false)}
                        confirm={handleDeleteCataegory} />
                )
            }
        </section>
    )
}

export default Category
