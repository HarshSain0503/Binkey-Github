import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import productReducer from './productSlice'
import cardReducer from './cartProduct'
import addressReducer from './addressSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        product: productReducer,
        cartItem: cardReducer,
        addresses: addressReducer
    },
})