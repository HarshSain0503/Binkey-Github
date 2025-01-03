import toast from "react-hot-toast"
import summaryApi from "../common/summaryApi"
import { useGlobalContext } from "../provider/GlobalProvider"
import Axios from "../utils/Axios"
import AxiosToastError from "../utils/axiosToastError"
import { useEffect, useState } from "react"
import Loading from './Loading'
import { useSelector } from "react-redux"
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(1)
    const [cartItemDetails, setCartItemDetails] = useState()

    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)

            const response = await Axios({
                ...summaryApi.addToCart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
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
        const checkingItem = cartItem.some(item => item.productId._id === data._id)
        setIsAvailableCart(checkingItem)

        const product = cartItem.find(item => item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemDetails(product)
    }, [data, cartItem])

    const decreaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (qty === 1) {
            deleteCartItem(cartItemDetails._id)
        }
        else {
            const response = await updateCartItem(cartItemDetails?._id, qty - 1)

            if (response.success) {
                toast.success("Item removed successfully")
            }
        }
    }

    const increaseQty = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const response = await updateCartItem(cartItemDetails?._id, qty + 1)

        if (response.success) {
            toast.success("Item added successfully")
        }
    }


    return (
        <div className="w-full max-w-[150px]">
            {
                isAvailableCart ? (
                    <div className="flex gap-1 w-full h-full">
                        <button onClick={decreaseQty} className='bg-green-500 hover:bg-green-700 text-white rounded p-1 flex-1 w-full flex items-center justify-center'><FaMinus /></button>
                        <p className="flex-1 w-full font-semibold flex items-center justify-center">{qty}</p>
                        <button onClick={increaseQty} className='bg-green-500 hover:bg-green-700 text-white rounded p-1 flex-1 w-full flex items-center justify-center'><FaPlus /></button>
                    </div>
                ) : (
                    <button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded">
                        {loading ? <Loading /> : "Add"}
                    </button>
                )
            }
        </div>
    )
}

export default AddToCartButton