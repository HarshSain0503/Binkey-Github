import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/axiosToastError'
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import CardLoading from './CardLoading';
import CardProduct from './CardProduct';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import valideUrlConvert from '../utils/validUrlConvert';

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(7).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.getProductByCategory,
                data: {
                    id: id,
                },
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
    };

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 250
    }


    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 250
    }

    const handleRedirectProductListPage = () => {
        const subCategory = subCategoryData.find(sub => {
            const filterData = sub.category.some(c => c._id === id);
            return filterData;
        });

        if (!subCategory || !subCategory.name) {
            { id, subCategory };
            return "/"; // Default fallback URL
        }

        const url = `/${valideUrlConvert(name)}-${id}/${valideUrlConvert(subCategory?.name)}-${subCategory?._id}`;
        return url;
    };

    const redirectURL = handleRedirectProductListPage() || "/"



    return (
        <div>
            <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
                <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
                <Link to={redirectURL} className='text-tertiary-100 hover:text-green-500'>See All</Link>
            </div>

            <div className='flex relative items-center'>
                <div className='flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 scroll-smooth overflow-x-scroll scrollbar-none' ref={containerRef}>
                    {loading &&
                        loadingCardNumber.map((_, index) => {
                            return (
                                <CardLoading key={"" + index} />
                            )
                        })
                    }

                    {
                        data.map((p, index) => {
                            return (
                                <CardProduct data={p} key={p._id + "CategoryWiseProductDisplay" + index} />
                            )
                        })
                    }
                </div>
                <div className='w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between'>
                    <button onClick={handleScrollLeft} className='z-10 relative bg-gray-200 hover:bg-gray-300 shadow-lg p-2 text-lg rounded-full'>
                        <FaAngleLeft />
                    </button>
                    <button onClick={handleScrollRight} className='z-10 relative bg-gray-200 hover:bg-gray-300 shadow-lg p-2 text-lg rounded-full'>
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay
