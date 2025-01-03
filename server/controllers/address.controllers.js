import AddressModel from '../models/address.model.js'
import UserModel from '../models/user.model.js'

export const addAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const { address_line, city, state, pincode, country, mobile } = req.body

        const createAddress = new AddressModel({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId: userId
        })

        const saveAddress = await createAddress.save()

        const addUserAddressId = await UserModel.findByIdAndUpdate(userId, {
            $push: {
                address_details: saveAddress._id
            }
        })

        return res.json({
            message: 'Address added successfully',
            error: false,
            success: true,
            data: saveAddress,
        })

    }
    catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const data = await AddressModel.find({ userId: userId }).sort({ createdAt: -1 })

        return res.json({
            message: 'Addresses fetched successfully',
            error: false,
            success: true,
            data: data,
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const { _id, address_line, city, state, pincode, country, mobile } = req.body

        const updateAddress = await AddressModel.updateOne({ _id: _id, userId: userId }, {
            address_line,
            city,
            state,
            pincode,
            country,
            mobile
        })

        return res.json({
            message: 'Address updated successfully',
            data: updateAddress,
            success: true,
            error: false
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const { _id } = req.body

        const disableAddress = await AddressModel.updateOne({ _id: _id, userId: userId }, {
            status: false
        })

        return res.json({
            message: 'Address deleted successfully',
            data: disableAddress,
            success: true,
            error: false
        })
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}