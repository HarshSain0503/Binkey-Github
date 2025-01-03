import { createContext, useContext, useEffect, useState } from "react";
import summaryApi from "../common/summaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/axiosToastError";
import { useDispatch, useSelector } from "react-redux";
import { handleAdditemCart } from "../store/cartProduct";
import toast from "react-hot-toast";
import { PriceWithDiscount } from '../utils/PricewWthDiscount'
import { handleAddress } from "../store/addressSlice";

export const GlobalContext = createContext(null)
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {
    const dispatch = useDispatch()
    const [totalPrice, setTotalPrice] = useState(0)
    const [notDiscountPrice, setNotDiscountPrice] = useState(0)
    const [totalQty, setTotalQty] = useState(0)
    const cartItem = useSelector((state) => state?.cartItem?.cart)

    const fetchCartItem = async () => {
        try {
            const response = await Axios({
                ...summaryApi.getCartItem
            })

            const { data: responseData } = response
            if (responseData.success) {
                dispatch(handleAdditemCart(responseData.data))
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
    }

    const updateCartItem = async (_id, qty) => {
        try {
            const response = await Axios({
                ...summaryApi.updateCartItemQuantity,
                data: {
                    _id: _id,
                    qty: qty
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                // toast.success(responseData.message)
                fetchCartItem()
                return responseData
            }
        }
        catch (error) {
            AxiosToastError(error)
            return error
        }
    }

    const deleteCartItem = async (cardId) => {
        try {
            const response = await Axios({
                ...summaryApi.deleteCartItemQuantity,
                data: {
                    _id: cardId,
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                fetchCartItem()
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
    }

    const fetchAddress = async () => {
        try {
            const response = await Axios({
                ...summaryApi.getAddress
            })

            const { data: responseData } = response
            if (responseData.success) {
                dispatch(handleAddress(responseData.data))
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
    }

    useEffect(() => {
        fetchCartItem()
        fetchAddress()
    }, [])

    useEffect(() => {
        const qty = cartItem.reduce((prev, curr) => {
            return prev + curr.quantity
        }, 0)
        setTotalQty(qty)

        const tPrice = cartItem.reduce((prev, curr) => {
            const priceAfterDisocunt = PriceWithDiscount(curr?.productId?.price, curr?.productId?.discount)
            return prev + (priceAfterDisocunt * curr?.quantity)
        }, 0)
        setTotalPrice(tPrice)

        const notDiscountPrice = cartItem.reduce((prev, curr) => {
            return prev + (curr?.productId?.price * curr?.quantity)
        }, 0)
        setNotDiscountPrice(notDiscountPrice)
    }, [cartItem])



    return (
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            totalPrice,
            totalQty,
            notDiscountPrice
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider