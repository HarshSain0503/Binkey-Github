import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/forgotPassword";
import OtpVerification from "../pages/otpVerification";
import ResetPassword from "../pages/resetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import Category from "../pages/Category";
import SubCategory from "../pages/SubCategory";
import Product from "../pages/ProductAdmin";
import UploadProduct from "../pages/UploadProduct";
import AdminPermission from "../layouts/AdminPermission";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CardMobilepage from "../pages/CardMobilepage";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "search",
                element: <SearchPage />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "verification-otp",
                element: <OtpVerification />,
            },
            {
                path: "reset-password",
                element: <ResetPassword />,
            },
            {
                path: "user",
                element: <UserMenuMobile />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "myorders",
                        element: <MyOrders />
                    },
                    {
                        path: "address",
                        element: <Address />
                    },
                    {
                        path: "category",
                        element: <AdminPermission><Category /></AdminPermission>
                    },
                    {
                        path: "subCategory",
                        element: <AdminPermission><SubCategory /></AdminPermission>
                    },
                    {
                        path: "product",
                        element: <AdminPermission><Product /></AdminPermission>
                    },
                    {
                        path: "upload-product",
                        element: <AdminPermission><UploadProduct /></AdminPermission>
                    }

                ]
            },
            {
                path: ":category",
                children: [
                    {
                        path: ":subCategory",
                        element: <ProductListPage />,
                    },
                ],
            },
            {
                path: "product/:product",
                element: <ProductDisplayPage />,
            },
            {
                path: "cart",
                element: <CardMobilepage />
            },
            {
                path: "checkout",
                element: <CheckoutPage />
            },
            {
                path: "success",
                element: <Success />
            },
            {
                path: "cancel",
                element: <Cancel />
            }
        ]
    }
]);

export default router;