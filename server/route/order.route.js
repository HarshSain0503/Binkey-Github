import { Router } from 'express'
import { CashOnDeliveryOrderController, paymentController } from '../controllers/order.controllers.js'
import auth from '../middleware/auth.js'

const orderRouter = Router()

orderRouter.post('/cash-on-delivery', auth, CashOnDeliveryOrderController)
orderRouter.post('/checkout', auth, paymentController)

export default orderRouter