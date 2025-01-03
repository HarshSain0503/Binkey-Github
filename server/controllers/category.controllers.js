import CategoryModel from '../models/category.model.js'
import subCategoryModel from '../models/subCategory.model.js'
import ProductModel from '../models/product.model.js'

export const AddCategoryController = async (req, res) => {
    try {
        const { name, image } = req.body

        if (!name || !image) {
            return res.status(400).json({
                message: 'Please provide name and image',
                error: true,
                success: false
            })
        }

        const addCategory = new CategoryModel({
            name,
            image
        })

        const saveCategory = await addCategory.save()

        if (!saveCategory) {
            return res.status(500).json({
                message: 'Category not created',
                error: true,
                success: false
            })
        }

        return res.json({
            message: 'Category added successfully',
            data: saveCategory,
            error: false,
            success: true
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

export const GetCategoryController = async (req, res) => {
    try {
        const data = await CategoryModel.find().sort({ createdAt: -1 })

        return res.json({
            message: 'Categories fetched successfully',
            data: data,
            error: false,
            success: true
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

export const updateCategoryController = async (req, res) => {
    try {
        const { _id, image, name } = req.body

        const update = await CategoryModel.updateOne({
            _id: _id
        }, {
            name: name,
            image: image
        })

        return res.json({
            message: 'Category updated successfully',
            data: update,
            error: false,
            success: true
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

export const deleteCategoryController = async (req, res) => {
    try {
        const { _id } = req.body

        if (!_id) {
            return res.status(400).json({
                message: "Category ID is required",
                error: true,
                success: false,
            });
        }

         // Check if the SubCategory exists
         const existingCategory = await CategoryModel.findById(_id);
         if (!existingCategory) {
             return res.status(404).json({
                 message: "Category not found",
                 error: true,
                 success: false,
             });
         }

        const checkSubCategory = await subCategoryModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        const checkProduct = await ProductModel.find({
            category: {
                "$in": [_id]
            }
        }).countDocuments()

        if (checkSubCategory > 0 || checkProduct > 0) {
            return res.status(400).json({
                message: "Category is already used can't delete it",
                error: true,
                success: false
            })
        }

        const deleteCategory = await CategoryModel.deleteOne({
            _id: _id
        })

        return res.json({
            message: 'Category deleted successfully',
            data: deleteCategory,
            error: false,
            success: true
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