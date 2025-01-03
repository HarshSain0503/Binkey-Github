import { useEffect, useState } from "react"
import UploadSubCategoryModel from "../component/UploadSubCategoryModel"
import AxiosToastError from "../utils/axiosToastError"
import Axios from "../utils/Axios"
import summaryApi from "../common/summaryApi"
import Displaytable from "../component/Displaytable"
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from "../component/ViewImage"
import { HiPencil } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import EditSubCategory from "../component/EditSubCategory"
import ConfirmBox from '../component/ConfirmBox'
import toast from "react-hot-toast"

const SubCategory = ({ close }) => {
    const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const columnHelper = createColumnHelper()
    const [imageUrl, setImageUrl] = useState('')
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({
        _id: ""
    })

    const [deleteSubCategory, setDeleteSubCategory] = useState({
        _id: ""
    })
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)

    const fetchSubCategory = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.getSubCategory
            })
            const { data: responseData } = response
            if (responseData.success) {
                setData(responseData.data)
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubCategory()
    }, [])

    const column = [
        columnHelper.accessor('name', {
            header: 'Name',
        }),
        columnHelper.accessor('image', {
            header: 'Image',
            cell: ({ row }) => {
                return (
                    <div className="flex items-centre justify-center">
                        <img src={row.original.image}
                            alt={row.original.name}
                            className="w-9 h-9 cursor-pointer"
                            onClick={() => {
                                setImageUrl(row.original.image)
                            }}
                        />
                    </div>
                )
            }
        }),
        columnHelper.accessor('category', {
            header: 'Category',
            cell: ({ row }) => {
                return (
                    <>
                        {
                            row.original.category.map((c, index) => {
                                return (
                                    <p key={c._id + "table"} className="px-1 shadow-md inline-block">{c.name}</p>
                                )
                            })
                        }
                    </>
                )
            }
        }),

        columnHelper.accessor('_id', {
            header: 'Action',
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => {
                            setOpenEdit(true)
                            setEditData(row.original)
                        }

                        }
                            className="p-2 bg-green-100 rounded-full hover:bg-green-200 hover:text-green-600">
                            <HiPencil size={18} />
                        </button>

                        <button onClick={() => {
                            setOpenDeleteConfirmBox(true)
                            setDeleteSubCategory(row.original)
                        }} className="p-2 bg-red-100 rounded-full hover:bg-red-200 hover:text-red-600 text-black">
                            <MdDelete size={18} />
                        </button>
                    </div>
                )
            }
        })
    ]

    const handleDeleteSubCategory = async() => {
        try {
            const response = await Axios({
                ...summaryApi.deleteSubCategory,
                data: deleteSubCategory
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                fetchSubCategory()
                setOpenDeleteConfirmBox(false)
                setDeleteSubCategory({_id: ""})
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
    }



    return (
        <section>
            <div className="p-2 bg-white shadow-md flex items-center justify-between">
                <h2 className="font-bold">Sub Category</h2>
                <button onClick={() => setOpenAddSubCategory(true)} className="text-sm font-semibold border border-tertiary-200 hover:border-tertiary-100
            hover:bg-tertiary-200 px-3 py-1 rounded">Add SubCategory</button>
            </div>

            <div className="overflow-auto w-full max-w-[95vw]">
                <Displaytable
                    data={data}
                    column={column}
                />
            </div>

            {
                openAddSubCategory && (
                    <UploadSubCategoryModel close={() => setOpenAddSubCategory(false)} fetchData={fetchSubCategory} />
                )
            }

            {
                imageUrl &&
                <ViewImage url={imageUrl} close={() => setImageUrl(null)} />
            }

            {
                openEdit && (
                    <EditSubCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchSubCategory} />
                )
            }

            {
                openDeleteConfirmBox && (
                    <ConfirmBox
                        cancel={() => setOpenDeleteConfirmBox(false)}
                        close={() => setOpenDeleteConfirmBox(false)}
                        confirm={handleDeleteSubCategory}
                    />
                )
            }
        </section>
    )
}

export default SubCategory
