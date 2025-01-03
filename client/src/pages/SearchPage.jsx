import { useEffect, useState } from "react"
import CardLoading from '../component/CardLoading'
import CardProduct from '../component/CardProduct'
import AxiosToastError from '../utils/axiosToastError'
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from "react-router-dom";
import noDataImage from '../assets/nothing here yet.png'

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalNoPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...summaryApi.searchProduct,
        data: {
          search: searchText,
          page: page
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        }
        else {
          setData((prev) => {
            return [
              ...prev,
              ...responseData.data
            ]
          })
        }
        setTotalPage(responseData.totalNoPage)
      }
    }
    catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, searchText])

  const handleFetchMore = () => {
    if (totalNoPage > page) {
      setPage(prev => prev + 1)
    }
  }



  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <p className="font-semibold">Search Results: {data.length}</p>

        <InfiniteScroll dataLength={data.length} hasMore={true} next={handleFetchMore}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4">

            {
              data.map((p, index) => {
                return (
                  <CardProduct data={p} key={p?._id + "searchProduct" + index} />
                )
              })
            }

            {/* Loading */}
            {
              loading && (
                loadingArrayCard.map((_, index) => {
                  return (
                    <CardLoading key={index} />
                  )
                })
              )
            }
          </div>
        </InfiniteScroll>

        {/* No Data */}
        {
          !data[0] && !loading && (
            <div className="flex flex-col justify-center items-center w-full mx-aut0">
              <img
                src={noDataImage}
                className="w-full h-full max-w-xs max-h-xs block"
              />
              <p className="font-semibold my-2">No Data found</p>
            </div>
          )
        }

      </div>
    </section>
  )
}

export default SearchPage