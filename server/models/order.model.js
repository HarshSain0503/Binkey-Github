import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    orderId: {
        type: String,
        required: [true, 'Provide Order Id'],
        unique: true
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product"
    },
    products_details: {
        name: String,
        image: Array
    },
    paymentId: {
        type: String,
        required: ""
    },
    payment_status: {
        type: String,
        required: ""
    },
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    },
    delivery_status: {
        type: String,
        required: ""
    },
    subTotalAmt: {
        type: Number,
        default: 0
    },
    totalAmt: {
        type: Number,
        default: 0
    },
    invoice_receipt: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const OrderModel = mongoose.model('order', orderSchema);

export default OrderModel;