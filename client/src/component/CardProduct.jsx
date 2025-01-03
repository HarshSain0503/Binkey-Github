import { Link } from "react-router-dom"
import DisplayRupees from "../utils/DisplayRupees"
import { validUrlConvert } from '../utils/validUrlConvert'
import { PriceWithDiscount } from "../utils/PricewWthDiscount";
import AddToCartButton from "./AddToCartButton.jsx";

const CardProduct = ({ data }) => {
    const Url = `/product/${validUrlConvert(data.name)}-${data._id}`


    return (
        <Link to={Url} className="border py-2 lg:p-4 grid gap-2 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white">
            <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
                <img
                    src={data.image[0]}
                    className="w-full h-full object-scale-down lg:scale-125 "
                />
            </div>

            <div className="flex items-center gap-3">
                <div className="p-[1px] text-xs text-tertiary-100 bg-green-100 rounded w-fit px-2">
                    10min
                </div>
                <div>
                    {
                        Boolean(data.discount) && (
                            <p className="font-bold text-green-600 bg-green-100 px-2 w-fit text-xs rounded">{data.discount}% <span className="text-sm text-neutral-500">Discount</span></p>
                        )
                    }
                </div>
            </div>

            <div className="px-2 lg:px-0 text-ellipsis font-medium text-sm lg:text-base line-clamp-2">
                {data.name}
            </div>
            <div className="w-fit px-2 lg:px-0 text-sm lg:text-base">
                {data.unit}
            </div>

            <div className="px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base">
                <div className="flex items-center gap-1">
                    <div className="font-semibold">
                        {DisplayRupees(PriceWithDiscount(data.price, data.discount))}
                    </div>

                </div>

                <div>
                    {
                        data.stock == 0 ? (
                            <p className="text-medium font-semibold text-red-500 text-center">Out of Stock</p>
                        ) : (
                            <AddToCartButton data={data} />
                        )
                    }

                </div>
            </div>
        </Link>
    )
}

export default CardProduct
