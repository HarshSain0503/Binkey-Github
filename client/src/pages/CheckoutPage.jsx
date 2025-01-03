import { useState } from "react"
import { useGlobalContext } from "../provider/GlobalProvider"
import DisplayRupees from "../utils/DisplayRupees"
import AddAddress from "../component/AddAddress"
import { useSelector } from "react-redux"
import Divider from "../component/Divider"
import AxiosToastError from "../utils/axiosToastError"
import Axios from "../utils/Axios"
import summaryApi from "../common/summaryApi"
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

const CheckoutPage = ({ close }) => {
    const { notDiscountPrice, totalPrice, totalQty, fetchCartItem } = useGlobalContext()
    const deliveryCharges = 50
    const GrandTotal = totalPrice + deliveryCharges
    const [openAddress, setOpenAddress] = useState(false)
    const addressList = useSelector(state => state.addresses.addressList)
    const [selectAddress, setSelectAddress] = useState(0)
    const cartItemList = useSelector(state => state.cartItem.cart)
    const navigate = useNavigate()

    const handleCashOnDelivery = async () => {
        try {
            const response = await Axios({
                ...summaryApi.CashOnDelivery,
                data: {
                    list_items: cartItemList,
                    addressId: addressList[selectAddress]?._id,
                    subTotalAmt: totalPrice,
                    totalAmt: GrandTotal
                }
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
                navigate('/success', {
                    state: {
                        text: "Order"
                    }
                })
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
    }

    const handleOnlinePaymnet = async () => {
        try {
            const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
            const stripePromise = await loadStripe(stripePublicKey)

            const response = await Axios({
                ...summaryApi.payment_url,
                data: {
                    list_items: cartItemList,
                    addressId: addressList[selectAddress]?._id,
                    subTotalAmt: totalPrice,
                    totalAmt: GrandTotal
                }
            })

            const { data: responseData } = response

            stripePromise.redirectToCheckout({ sessionId: responseData._id })
        }
        catch (error) {
            AxiosToastError(error)
        }
    }


    return (
        <section className="bg-blue-50">
            <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between items-stretch">
                <div className="w-full mt-1">
                    {/* Address */}
                    <h3 className="text-lg font-semibold ml-1">Choose Your Address</h3>

                    <div className="p-2 grid gap-5 bg-white mt-2">
                        {
                            addressList.map((address, index) => {
                                return (
                                    <label key={"address" + index} htmlFor={"address" + index} className={`${!address.status && "hidden"}`}>
                                        <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                                            <div>
                                                <input
                                                    type="radio"
                                                    id={"address" + index}
                                                    value={index}
                                                    name="address"
                                                    onChange={(e) => setSelectAddress(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <p>{address.address_line}</p>
                                                <p>{address.city}</p>
                                                <p>{address.state}</p>
                                                <p>{address.country} - {address.pincode}</p>
                                                <p>{address.mobile}</p>
                                            </div>
                                        </div>
                                    </label>
                                )
                            })
                        }
                        <div onClick={() => setOpenAddress(true)} className="h-16 bg-blue-50 cursor-pointer border-2 border-dashed border-gray-300 flex justify-center items-center">
                            Add Address
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md bg-white py-4 px-2">
                    {/* Summary */}
                    <h3 className="text-lg font-semibold ml-1">Summary</h3>
                    <Divider />
                    <div className="bg-white p-4">
                        <h3 className="font-semibold">Bill details</h3>
                        <div className="flex gap-4 justify-between ml-1">
                            <p>Items total</p>
                            <p className="flex items-center gap-3">
                                <span className="line-through text-neutral-500">{DisplayRupees(notDiscountPrice)}</span>
                                <span>{DisplayRupees(totalPrice)}</span>
                            </p>
                        </div>

                        <div className="flex gap-4 justify-between ml-1">
                            <p>Quantity total</p>
                            <p className="flex items-center gap-3">{totalQty} Items</p>
                        </div>

                        <div className="flex gap-4 justify-between ml-1">
                            <p>Delivery Charge</p>
                            <p className="flex items-center gap-3">{deliveryCharges}</p>
                        </div>

                        <div className="font-semibold flex gap-4 items-center justify-between ml-1">
                            <p>Grand total</p>
                            <p>{DisplayRupees(GrandTotal)}</p>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <button onClick={handleOnlinePaymnet} className="py-2 px-4 border bg-green-600 hover:bg-green-700 rounded text-white font-semibold">Online Payment</button>
                        <button onClick={handleCashOnDelivery} className="py-2 px-4 border-2 border-tertiary-100 hover:bg-yellow-400 rounded text-tertiary-100 font-semibold">Cash on Delivery</button>
                    </div>
                </div>
            </div>

            {
                openAddress && (
                    <AddAddress close={() => setOpenAddress(false)} />
                )
            }
        </section>
    )
}

export default CheckoutPage
