import { Router } from 'express'
import auth from '../middleware/auth.js'
import { AddCategoryController, deleteCategoryController, GetCategoryController, updateCategoryController } from '../controllers/category.controllers.js'

const categoryRouter = Router()

categoryRouter.post('/add-category', auth, AddCategoryController)
categoryRouter.get('/get-category', GetCategoryController)
categoryRouter.put('/update',auth, updateCategoryController)
categoryRouter.delete('/delete', auth, deleteCategoryController)

export default categoryRouter