import { IoClose } from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom"
import { useGlobalContext } from "../provider/GlobalProvider"
import DisplayRupees from "../utils/DisplayRupees"
import { FaArrowRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import AddToCartButton from "../component/AddToCartButton"
import { PriceWithDiscount } from "../utils/PricewWthDiscount";
import EmptyImage from '../assets/empty_cart.png'
import toast from "react-hot-toast";

const DisplayCartItem = ({ close }) => {
    const { notDiscountPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const deliveryCharges = 50
    const GrandTotal = totalPrice + deliveryCharges
    const navigate = useNavigate()

    const redirectToCheckoutPage = () => {
        if (user?._id) {
            navigate("/checkout")
            if (close) {
                close()
            }
            return
        }
        toast.error("You are not logged in. Please log in to proceed")
    }


    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-70 z-50">
            <div className="bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto">
                <div className="flex items-center justify-between p-4 shadow-md gap-3">
                    <h2 className="font-semibold">Cart</h2>
                    <Link to={"/"} onClick={close} className="lg:hidden">
                        <IoClose size={22} />
                    </Link>
                    <button onClick={close} className="hidden lg:block">
                        <IoClose size={22} />
                    </button>
                </div>

                <div className="max-h-[calc(100vh-150px)] min-h-[80vh] lg:min-h-[80vh] bg-blue-50 p-2 flex flex-col gap-4">
                    {/* Display Items */}
                    {
                        cartItem[0] ? (
                            <>
                                <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full">
                                    <p>Your total savings</p>
                                    <p>{DisplayRupees(notDiscountPrice - totalPrice)}</p>
                                </div>

                                <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
                                    {
                                        cartItem[0] && (
                                            cartItem.map((item, index) => {
                                                return (
                                                    <div key={item + index} className="flex w-full gap-4">
                                                        <div className="w-16 h-16 min-w-16 min-h-16 bg-red-500 border rounded">
                                                            <img
                                                                src={item?.productId?.image[0]}
                                                                className="object-scale-down"
                                                            />
                                                        </div>

                                                        <div className="w-full max-w-sm text-xs">
                                                            <p className="text-xs font-semibold text-ellipsis line-clamp-2">{item?.productId?.name}</p>
                                                            <p className="text-neutral-500 font-semibold">{item?.productId?.unit}</p>
                                                            <p className="font-semibold text-neutral-600">{DisplayRupees(PriceWithDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                                                        </div>

                                                        <div>
                                                            <AddToCartButton data={item?.productId} />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                    }
                                </div>

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
                            </>
                        ) : (
                            <div className="bg-white flex flex-col justify-center items-center">
                                <img
                                    src={EmptyImage}
                                    className="w-full h-full object-scale-down"
                                />
                                <Link onClick={close} to={'/'} className="block bg-green-600 px-4 py-2 text-white rounded font-semibold">Shop Now</Link>
                            </div>
                        )
                    }
                </div>

                {
                    cartItem[0] && (
                        <div className="p-2">
                            <div className="bg-green-700 text-neutral-100 static p-4 font-bold text-base rounded flex items-center justify-between gap-4">
                                <div>
                                    {DisplayRupees(totalPrice)}
                                </div>

                                <button onClick={redirectToCheckoutPage} className="flex items-center gap-1">
                                    Proceed
                                    <span><FaArrowRight /></span>
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </section>
    )
}

export default DisplayCartItem
