import CartProductModel from '../models/cartProduct.model.js'
import UserModel from '../models/user.model.js'

export const addToCartController = async (req, res) => {
    try {
        const userId = req.userId
        const { productId } = req.body

        if (!productId) {
            return res.status(400).json({
                message: 'Product ID is required',
                success: false,
                error: true
            })
        }

        const checkItemCart = await CartProductModel.findOne({
            userId: userId,
            productId: productId
        })

        if (checkItemCart) {
            return res.status(400).json({
                message: 'Item already in cart',
                success: false,
                error: true
            })
        }

        const cartItem = new CartProductModel({
            quantity: 1,
            userId: userId,
            productId: productId
        })

        const save = await cartItem.save()
        const updateUser = await UserModel.updateOne({ _id: userId }, {
            $push: {
                shopping_cart: productId,
            }
        })

        return res.json({
            message: 'Product added to cart successfully',
            success: true,
            error: false,
            data: save
        })
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export const getCartController = async (req, res) => {
    try {
        const userId = req.userId
        const cartItem = await CartProductModel.find({
            userId: userId
        }).populate('productId')

        return res.json({
            message: 'Cart items fetched successfully',
            success: true,
            error: false,
            data: cartItem
        })
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export const updateCartController = async (req, res) => {
    try {
        const userId = req.userId
        const { _id, qty } = req.body

        if (!_id && !qty) {
            return res.status(400).json({
                message: 'Product ID and quantity are required',
                success: false,
                error: true
            })
        }

        const updateCartItem = await CartProductModel.updateOne({
            _id: _id,
            userId: userId
        }, {
            quantity: qty
        })

        if (qty !== 0) {
            return res.json({
                message: 'Cart item updated successfully',
                success: true,
                error: false,
                data: updateCartItem
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export const deleteCartController = async (req, res) => {
    try {
        const userId = req.userId
        const { _id } = req.body

        if (!_id) {
            return res.status(400).json({
                message: 'Product ID is required',
                success: false,
                error: true
            })
        }

        const deleteCartItem = await CartProductModel.deleteOne({
            _id: _id,
            userId: userId
        })

        return res.json({
            message: 'Cart item remove successfully',
            success: true,
            error: false,
            data: deleteCartItem
        })
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}