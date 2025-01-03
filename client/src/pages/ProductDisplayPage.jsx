import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../utils/Axios"
import summaryApi from "../common/summaryApi"
import AxiosToastError from "../utils/axiosToastError"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import DisplayRupees from '../utils/DisplayRupees'
import Divider from '../component/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { PriceWithDiscount } from "../utils/PricewWthDiscount";
import AddToCartButton from "../component/AddToCartButton";

const ProductDisplayPage = () => {
    const params = useParams()
    let productId = params?.product?.split("-")?.slice(-1)[0]
    const [data, setData] = useState({
        name: "",
        image: []
    })
    const [image, setImage] = useState(0)
    const [loading, setLoading] = useState(false)
    const imageContainer = useRef()

    const fetchProductDetails = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.getProductDetails,
                data: {
                    productId: productId
                }
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
        fetchProductDetails()
    }, [params])

    const handleScrollRight = () => {
        imageContainer.current.scrollLeft += 100
    }

    const handleScrollLeft = () => {
        imageContainer.current.scrollLeft -= 100
    }



    return (
        <section className="container mx-auto p-4 grid lg:grid-cols-2">
            <div className="">
                <div className="bg-white lg:min-h-[63vh] lg:max-h-[63vh] rounded min-h-56 max-h-56 h-full w-full">
                    <img
                        src={data.image[image]}
                        className="w-full h-full object-scale-down"
                    />
                </div>

                <div className="flex items-center justify-center gap-3 my-3">
                    {
                        data.image.map((img, index) => {
                            return (
                                <div key={img + index} className={`bg-slate-200 lg:w-5 lg:h-5 h-3 w-3 rounded-full ${index === image && "bg-slate-400"}`}>
                                </div>
                            )
                        })
                    }
                </div>

                <div className="grid relative">
                    <div className="flex relative z-10 gap-4 lg:ml-6 w-full overflow-x-auto my-2 scrollbar-none">
                        {
                            data.image.map((img, index) => {
                                return (
                                    <div key={img + index} className="w-20 h-20 min-h-20 min-w-20 shadow-md">
                                        <img
                                            src={img}
                                            alt="Min-Product"
                                            onClick={() => setImage(index)}
                                            className="w-full h-full object-scale-down cursor-pointer"
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="w-full h-full -ml-2 flex justify-between items-center absolute" ref={imageContainer}>
                        <button onClick={handleScrollLeft} className="bg-white hidden lg:block relative p-1 rounded-full shadow-lg z-10">
                            <FaAngleLeft />
                        </button>

                        <button onClick={handleScrollRight} className="bg-white hidden lg:block relative p-1 rounded-full shadow-lg z-10">
                            <FaAngleRight />
                        </button>
                    </div>
                </div>

                <div className="my-4 hidden lg:grid gap-3">
                    <div>
                        <p className="font-semibold">Description</p>
                        <p className="text-base">{data.description}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Unit</p>
                        <p className="text-base">{data.unit}</p>
                    </div>

                    {
                        data?.more_details && Object.keys(data?.more_details).map((element, index) => {
                            return (
                                <div key={index}>
                                    <p className="font-semibold">{element}</p>
                                    <p className="text-base">{data?.more_details[element]}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className="p-4 lg:pl-7 text-base lg:text-lg">
                <p className="bg-green-200 w-fit px-2 rounded-full">10 min</p>
                <h2 className="text-lg font-semibold lg:text-3xl">{data.name}</h2>
                <p className="">{data.unit}</p>
                <Divider />
                <div>
                    <p className="">Price</p>
                    <div className="flex items-center gap-2 lg:gap-4">
                        <div className="border border-tertiary-100 px-4 py-1 w-fit rounded bg-green-50">
                            <p className="font-semibold text-lg lg:text-xl">{DisplayRupees(PriceWithDiscount(data.price, data.discount))}</p>
                        </div>

                        {
                            data.discount && (
                                <p className="line-through">{DisplayRupees(data.price)}</p>
                            )
                        }

                        {
                            data.discount && (
                                <p className="font-bold text-green-600 lg:text-2xl">{data.discount}% <span className="text-base text-neutral-500">Discount</span></p>
                            )
                        }
                    </div>
                </div>
                {
                    data.stock === 0 ? (
                        <p className="text-lg font-semibold text-red-500 my-1">Out of Stock</p>
                    ) : (
                        <div className="my-4 text-base font-semibold">
                            <AddToCartButton data={data} />
                        </div>
                    )
                }

                <h2 className="font-semibold">Why shop from Binkeyit</h2>
                <div>
                    <div className="flex items-center gap-4 my-4">
                        <img
                            src={image1}
                            alt="Superfast Delivery"
                            className="w-20 h-20"
                        />

                        <div className="text-sm">
                            <div className="font-semibold">Superfast Delivery</div>
                            <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 my-4">
                        <img
                            src={image2}
                            alt="Best prices offers"
                            className="w-20 h-20"
                        />

                        <div className="text-sm">
                            <div className="font-semibold">Best Prices & offers</div>
                            <p>Best price destination with offers directly from the manufactures.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 my-4">
                        <img
                            src={image3}
                            alt="Wide Assortment"
                            className="w-20 h-20"
                        />

                        <div className="text-sm">
                            <div className="font-semibold">Wide Assortment</div>
                            <p>Choose from 5000+ products across food, personal care, household & other categories.</p>
                        </div>
                    </div>
                </div>

                {/* Only for Mobile */}
                <div className="my-4 lg:hidden grid gap-3">
                    <div>
                        <p className="font-semibold">Description</p>
                        <p className="text-base">{data.description}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Unit</p>
                        <p className="text-base">{data.unit}</p>
                    </div>

                    {
                        data?.more_details && Object.keys(data?.more_details).map((element, index) => {
                            return (
                                <div key={index}>
                                    <p className="font-semibold">{element}</p>
                                    <p className="text-base">{data?.more_details[element]}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default ProductDisplayPage
