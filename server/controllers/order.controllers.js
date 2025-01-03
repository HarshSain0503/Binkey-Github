import OrderModel from '../models/order.model.js'
import UserModel from '../models/user.model.js'
import CartProductModel from '../models/cartProduct.model.js'
import mongoose from 'mongoose'
import Stripe from 'stripe'

export async function CashOnDeliveryOrderController(req, res) {
    try {
        const userId = req.userId
        const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

        const payload = list_items.map((el) => ({
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            productId: el.productId._id,
            products_details: {
                name: el.productId.name,
                image: el.productId.image,
            },
            paymentId: "Payment_Id",
            payment_status: "CASH ON DELIVERY",
            delivery_status: "Processing",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt,
            totalAmt: totalAmt,
        }));

        const generatedOrder = await OrderModel.insertMany(payload)
        // Remove from the cart
        const removeCartItems = await CartProductModel.deleteMany({ userId: userId });
        const updateInUser = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

        return res.json({
            message: 'Order placed successfully',
            data: generatedOrder,
            error: false,
            success: true
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export const PriceWithDiscount = (price, dis = 1) => {
    const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmount)
    return actualPrice
}

export async function paymentController(req, res) {
    try {
        const userId = req.userId
        const { list_items, totalAmt, addressId, subTotalAmt } = req.body;
        const user = await UserModel.findById(userId)

        const line_items = list_items.map(item => {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.productId.name,
                        images: item.productId.image,
                        metadata: {
                            productId: item.productId._id
                        }
                    },
                    unit_amount: PriceWithDiscount(item.productId.price, item.productId.discount) * 100
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1
                },
                quantity: item.quantity
            }
        })

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: userId,
                addressId: addressId
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        }

        const session = await Stripe.checkout.sessions.create(params)

        return res.status(200).json(session)
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}