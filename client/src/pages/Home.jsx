import banner from '../assets/banner.png'
import bannerMobile from '../assets/banner-mobile.png'
import { useSelector } from 'react-redux'
import valideUrlConvert from '../utils/validUrlConvert'
import { useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../component/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListPage = (id, cat) => {
    const subCategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })

      return filterData ? true : null
    })

    const url = `/${valideUrlConvert(cat)}-${id}/${valideUrlConvert(subCategory.name)}-${subCategory._id}`
    navigate(url)
  }

  return (
    <section className='bg-white'>
      <div className="container mx-auto">
        <div className={`min-h-48 w-full h-full bg-blue-100 ${!banner && "animate-pulse my-2"} rounded`}>
          <img
            src={banner}
            className='w-full h-full hidden lg:block'
            alt='banner'
          />

          <img
            src={bannerMobile}
            className='w-full h-full lg:hidden'
            alt='bannerMobile'
          />
        </div>
      </div>

      <div className='container mx-auto px-4 my-3 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2'>
        {
          loadingCategory ? (
            new Array(12).fill(null).map((c, index) => {
              return (
                <div key={index} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                  <div className='bg-blue-100 min-h-28 rounded'></div>
                  <div className='bg-blue-100 h-8 rounded'></div>
                </div>
              )
            })
          ) : (
            categoryData.map((cat, index) => {
              return (
                <div key={cat._id} className='w-full h-full' onClick={() => handleRedirectProductListPage(cat._id, cat.name)}>
                  <div>
                    <img
                      src={cat.image}
                      className='w-full h-full object-scale-down cursor-pointer'
                    />
                  </div>
                </div>
              )
            })
          )
        }
      </div>

      {/* display category product */}
      {
        categoryData.map((cats, index) => {
          return (
            <CategoryWiseProductDisplay key={(cats?.id || index) + "CategoryWiseProduct"} id={cats?._id} name={cats?.name} />
          )
        })
      }

    </section>
  )
}

export default Home
