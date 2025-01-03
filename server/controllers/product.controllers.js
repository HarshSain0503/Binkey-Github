import ProductModel from '../models/product.model.js'

export const createProductController = async (req, res) => {
    try {
        const {
            name, image, category, subCategory, unit,
            stock, price, discount, description, more_details
        } = req.body

        if (!name || !image[0] || !category[0] || !subCategory[0] || !unit || !stock || !price) {
            return res.status(400).json({
                message: 'All fields are required',
                error: true,
                success: false
            })
        }

        const product = new ProductModel({
            name, image, category, subCategory, unit,
            stock, price, discount, description, more_details
        })
        const saveproduct = await product.save()

        return res.json({
            message: 'Product created successfully',
            product: saveproduct,
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

export const getProductController = async (req, res) => {
    try {
        let { page, limit, search } = req.body

        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 12
        }

        const query = search ? { $text: { $search: search } } : {}

        const skip = (page - 1) * limit;

        const [data, totalCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("category subCategory"),
            ProductModel.countDocuments(query)
        ])

        return res.json({
            message: 'Products data fetched successfully',
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
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

export const getProductByCategory = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(404).json({
                message: 'Category ID is required',
                error: true,
                success: false
            })
        }

        const product = await ProductModel.find({
            category: { $in: id }
        }).limit(15)

        return res.json({
            message: 'Products data fetched successfully',
            data: product,
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

export const getProductByCategoryAndSubCategory = async (req, res) => {
    try {
        const { categoryId, subCategoryId, page, limit } = req.body

        if (!categoryId || !subCategoryId) {
            return res.status(404).json({
                message: 'Category ID and Subcategory ID are required',
                error: true,
                success: false
            })
        }

        if (!page) {
            page = 1
        }
         
        if (!limit) {
            limit = 10
        }

        const skip = (page - 1) * limit

        const query = {
            category: { $in: categoryId },
            subCategory: { $in: subCategoryId },
        }

        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return res.json({
            message: 'Products data fetched successfully',
            totalCount: dataCount,
            page: page,
            limit: limit,
            totalNoPage: Math.ceil(dataCount / limit),
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

export const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await ProductModel.findOne({ _id: productId })

        return res.json({
            message: 'Product data fetched successfully',
            data: product,
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

export const updateProductDetails = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({
                message: 'Product ID is required',
                error: true,
                success: false
            })
        }

        const updatedProduct = await ProductModel.updateOne(
            { _id: _id },
            { $set: req.body }
        );

        if (updatedProduct.matchedCount === 0) {
            return res.status(404).json({
                message: 'Product not found',
                error: true,
                success: false
            });
        }

        return res.json({
            message: 'Product updated successfully',
            product: updatedProduct,
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

export const deleteProductDetails = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(404).json({
                message: 'ID of the product is not provided',
                success: false,
                error: true
            })
        }

        const deleteProduct = await ProductModel.deleteOne({ _id: _id })

        return res.status(200).json({
            message: "Product Deleted Successfully",
            data: deleteProduct,
            success: true,
            error: false
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

export const searchProduct = async (req, res) => {
    try {
        let { search, page, limit } = req.body

        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 10
        }

        const query = search ? {
            $text : {
                $search : search
            }
        } : {}

        const skip = (page - 1) * limit
        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1}).skip(skip).limit(limit).populate("category subCategory"),
            ProductModel.countDocuments(query)
        ])

        return res.json({
            message: 'Products data fetched successfully',
            totalCount: dataCount,
            page: page,
            limit: limit,
            totalNoPage: Math.ceil(dataCount / limit),
            data: data,
            error: false,
            success: true
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