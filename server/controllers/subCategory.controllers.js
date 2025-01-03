import subCategoryModel from '../models/subCategory.model.js'
import ProductModel from '../models/product.model.js'

export const addSubCategoryController = async (req, res) => {
    try {
        const { name, image, category } = req.body

        if (!name && !image && !category[0]) {
            return res.status(400).json({
                message: 'Please provide name, image and category',
                error: true,
                success: false
            })
        }

        const payload = {
            name,
            image,
            category
        }

        const createSubCategory = new subCategoryModel(payload)
        const save = await createSubCategory.save()

        return res.json({
            message: 'Sub-Category created successfully',
            data: save,
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

export const getSubCategoryController = async (req, res) => {
    try {
        const data = await subCategoryModel.find().sort({ createdAt: -1 }).populate('category')

        return res.json({
            message: 'Sub-Categories fetched successfully',
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

export const updateSubCategoryController = async (req, res) => {
    try {
        const { _id, name, image, category } = req.body

        const checkSubcategory = await subCategoryModel.findById(_id)

        if (!checkSubcategory) {
            return res.status(404).json({
                message: 'Sub-Category not found',
                error: true,
                success: false
            })
        }

        const updateSubCategory = await subCategoryModel.findByIdAndUpdate(_id, {
            name,
            image,
            category
        })

        return res.json({
            message: 'Sub-Category updated successfully',
            data: updateSubCategory,
            error: false,
            success: true
        })

    }
    catch {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteSubCategoryController = async (req, res) => {
    try {
        const { _id } = req.body

        if (!_id) {
            return res.status(400).json({
                message: "Sub-Category ID is required",
                error: true,
                success: false,
            });
        }

        // Check if the SubCategory exists
        const existingSubCategory = await subCategoryModel.findById(_id);
        if (!existingSubCategory) {
            return res.status(404).json({
                message: "Sub-Category not found",
                error: true,
                success: false,
            });
        }

        const checkProduct = await ProductModel.find({
            subCategory: {
                "$in": [_id]
            }
        }).countDocuments()

        if (checkProduct > 0) {
            return res.status(400).json({
                message: "SubCategory is already used can't delete it",
                error: true,
                success: false
            })
        }

        const deleteSubCategory = await subCategoryModel.deleteOne({
            _id: _id
        })

        return res.json({
            message: 'Sub-Category deleted successfully',
            data: deleteSubCategory,
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