import { useEffect, useState } from 'react'
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/axiosToastError';
import Loading from '../component/Loading';
import ProductCardAdmin from '../component/ProductCardAdmin';
import { IoSearchOutline } from "react-icons/io5";

const Product = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")
  const limit = 12;


  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...summaryApi.getProduct,
        data: {
          page: page,
          limit: limit,
          search: search
        }
      })
      const { data: responseData } = response

      if (responseData.success) {
        setProductData(responseData.data)
        setTotalPageCount(Math.ceil(responseData.totalCount / limit)); //
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
    fetchProductData()
  }, [page])

  const handleNext = async () => {
    if (page < totalPageCount) {
      setPage(prev => prev + 1)
    }
  }

  const handlePrevious = async () => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }

  const handleOnchange = (e) => {
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(() => {
    let flag = true
    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData()
        flag = false
      }
    }, 1000);

    return () => {
      clearTimeout(interval)
    };
  }, [search])



  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-bold">Product</h2>
        <div className='h-full min-w-24 max-w-56 w-full ml-auto border border-tertiary-200 px-4 flex items-center gap-3 rounded text-black cursor-pointer py-2 focus-within:bg-slate-50 focus-within:border-tertiary-100'>
          <IoSearchOutline size={21} />
          <input
            type='text'
            placeholder='Search product here...'
            className='h-full w-full outline-none bg-transparent'
            value={search}
            onChange={handleOnchange}
          />
        </div>
      </div>
      {
        loading && (
          <Loading />
        )
      }

      <div className='p-4'>
        <div className='min-h-[56vh]'>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5'>
            {
              productData.map((p, index) => {
                return (
                  <ProductCardAdmin
                    data={p}
                    fetchProductData = {fetchProductData}
                    key={p._id || index}
                  />
                )
              })
            }
          </div>
        </div>


        <div className='flex justify-between my-8'>
          <button onClick={handlePrevious} className='border border-tertiary-100 px-4 py-1 hover:bg-tertiary-200 hover:border-tertiary-100' hidden={page === 1}>Previous</button>
          <button className='w-full cursor-text'>{page}/{totalPageCount}</button>
          <button onClick={handleNext} className='border border-tertiary-100 px-4 py-1 mr-10 hover:bg-tertiary-200 hover:border-tertiary-100' hidden={page === totalPageCount}>Next</button>
        </div>
      </div>
    </section>
  )
}

export default Product
