import { Router} from 'express'
import auth from '../middleware/auth.js'
import { addSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from '../controllers/subCategory.controllers.js'

const subCategoryRouter = Router()

subCategoryRouter.post('/createSubCategory',auth,addSubCategoryController)
subCategoryRouter.post('/getSubCategory',getSubCategoryController)
subCategoryRouter.put('/updateSubcategory',auth,updateSubCategoryController)
subCategoryRouter.delete('/deleteSubCategory',auth,deleteSubCategoryController)

export default subCategoryRouter