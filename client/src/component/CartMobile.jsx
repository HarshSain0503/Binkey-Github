import { useGlobalContext } from "../provider/GlobalProvider"
import { GrCart } from "react-icons/gr";
import DisplayRupees from "../utils/DisplayRupees";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { useSelector } from "react-redux";

const CartMobile = () => {
    const { totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const location = useLocation();

    const isCheckoutPage = location.pathname === "/checkout";
    

    return (
        <>
            {
                !isCheckoutPage && cartItem[0] && (
                    <div className='p-2 sticky bottom-4'>
            <div className='bg-green-700 hover:bg-green-600 px-2 py-1 rounded text-white text-sm flex items-center lg:hidden justify-between gap-3'>
                <div className="flex item-centre gap-2">
                    <div className='animate-bounce p-2 roundedbg-green-500 w-fit mt-1'>
                        <GrCart size={16} />
                    </div>

                    <div className=" text-xs font-semibold">
                        <p>{totalQty} Items</p>
                        <p>{DisplayRupees(totalPrice)}</p>
                    </div>
                </div>

                <Link to={"/cart"} className="flex items-center gap-1" >
                    <span className="text-sm">View Cart</span>
                    <FaArrowRight />
                </Link>
            </div>
        </div>  
                )
            }
        </>
    )
}

export default CartMobile
