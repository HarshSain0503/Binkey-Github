import { Router } from "express";
import auth from '../middleware/auth.js'
import { addToCartController, deleteCartController, getCartController, updateCartController } from "../controllers/cart.controllers.js";

const cartRouter = Router()

cartRouter.post('/create', auth, addToCartController)
cartRouter.get('/get', auth, getCartController)
cartRouter.put('/update-quantity', auth, updateCartController)
cartRouter.delete('/delete-quantity', auth, deleteCartController)

export default cartRouter