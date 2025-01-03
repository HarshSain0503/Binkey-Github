import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Axios from "../utils/Axios"
import summaryApi from "../common/summaryApi"
import AxiosToastError from "../utils/axiosToastError"
import Loading from '../component/Loading'
import CardProduct from "../component/CardProduct"
import { useSelector } from "react-redux"
import valideUrlConvert from '../utils/validUrlConvert'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const limit = 12
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [displaySubCategory, setDisplaySubCategory] = useState([])

  const params = useParams()
  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")

  const categoryId = params.category.split("-").slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...summaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: limit
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        }
        else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      }
    }
    catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductData()
  }, [params]);


  useEffect(() => {
    const sub = AllSubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id === categoryId
      })
      return filterData ? filterData : false
    })
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory]);


  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
        {/* Sub Category */}
        <div className="min-h-[88vh] max-h-[88vh] overflow-y-scroll lg:py-2 grid gap-1 shadow-md scrollbarCustom bg-white py-2">
          {
            displaySubCategory.map((s, index) => {
              const link = `/${valideUrlConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideUrlConvert(s.name)}-${s._id}`

              return (
                <Link to={link} key={index} className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b cursor-pointer hover:bg-green-200 ${subCategoryId === s._id ? "bg-green-100" : ""}`}>

                  <div className="w-fit mx-auto lg:mx-0 rounded box-border">
                    <img
                      src={s.image}
                      alt="Sub Category"
                      className="w-14 lg:h-14 lg:w-12 h-full object-scale-down"
                    />
                  </div>
                  <p className="-mt-6 lg:mt-0 text-xs text-center lg:text-sm lg:text-left">{s.name}</p>
                </Link>
              )
            })
          }
        </div>

        {/* Product */}
        <div className="sticky top-20">
          <div className="bg-white shadow-md p-4 z-10">
            <h3 className="font-semibold">{subCategoryName}</h3>
          </div>

          <div className="mt-1">
            <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4 rounded">
                {
                  data.map((p, index) => {
                    return (
                      <CardProduct data={p} key={p._id + "CategoryWiseProductDisplay" + index} />
                    )
                  })
                }
              </div>
            </div>

            {
              loading && (
                <Loading />
              )
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
