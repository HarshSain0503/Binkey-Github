export const baseUrl = "http://localhost:8080"

const summaryApi = {
    register: {
        url: "/api/user/register",
        method: "post"
    },
    login: {
        url: "/api/user/login",
        method: "post"
    },
    forgot_password: {
        url: "/api/user/forgot-password",
        method: "put"
    },
    verification_otp: {
        url: "/api/user/verify-forgot-password-otp",
        method: "put"
    },
    reset_password: {
        url: "/api/user/reset-password",
        method: "put"
    },
    refreshToken: {
        url: "/api/user/refresh-token",
        method: "post"
    },
    userDetails: {
        url: "/api/user/user-details",
        method: "get"
    },
    logout: {
        url: "/api/user/logout",
        method: "post"
    },
    uploadAvatar: {
        url: "/api/user/upload-avatar",
        method: "put"
    },
    updateUserDetails: {
        url: "/api/user/update-user",
        method: "put"
    },
    addCategory: {
        url: "/api/category/add-category",
        method: "post"
    },
    uploadImage: {
        url: "/api/file/upload",
        method: "post"
    },
    getCategory: {
        url: "/api/category/get-category",
        method: "get"
    },
    updateCategory: {
        url: "/api/category/update",
        method: "put"
    },
    deleteCategory: {
        url: "/api/category/delete",
        method: "delete"
    },
    createSubCategory: {
        url: '/api/subcategory/createSubCategory',
        method: 'post'
    },
    getSubCategory: {
        url: '/api/subcategory/getSubCategory',
        method: 'post'
    },
    updateSubCategory: {
        url: '/api/subcategory/updateSubcategory',
        method: 'put'
    },
    deleteSubCategory: {
        url: '/api/subcategory/deleteSubcategory',
        method: 'delete'
    },
    createProduct: {
        url: '/api/product/createProduct',
        method: 'post'
    },
    getProduct: {
        url: '/api/product/getProduct',
        method: 'post'
    },
    getProductByCategory: {
        url: '/api/product/get-product-by-category',
        method: 'post'
    },
    getProductByCategoryAndSubCategory: {
        url: '/api/product/get-product-by-category-and-subcategory',
        method: 'post'
    },
    getProductDetails: {
        url: '/api/product/get-product-details',
        method: 'post'
    },
    updateProductDetails: {
        url: '/api/product/update-product-details',
        method: 'put'
    },
    deleteProductDetails: {
        url: '/api/product/delete-product-details',
        method: 'delete'
    },
    searchProduct: {
        url: '/api/product/search-products',
        method: 'post'
    },
    addToCart: {
        url: '/api/cart/create',
        method: 'post'
    },
    getCartItem: {
        url: '/api/cart/get',
        method: 'get'
    },
    updateCartItemQuantity: {
        url: '/api/cart/update-quantity',
        method: 'put'
    },
    deleteCartItemQuantity: {
        url: '/api/cart/delete-quantity',
        method: 'delete'
    },
    createAddress: {
        url: '/api/address/create',
        method: 'post'
    },
    getAddress: {
        url: '/api/address/get',
        method: 'get'
    },
    updateAddress: {
        url: '/api/address/update',
        method: 'put'
    },
    disableAddress: {
        url: '/api/address/disable',
        method: 'delete'
    },
    CashOnDelivery: {
        url: '/api/order/cash-on-delivery',
        method: 'post'
    },
    payment_url: {
        url: '/api/order/checkout',
        method: 'post'
    }
}

export default summaryApi;