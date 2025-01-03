import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import summaryApi from '../common/summaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/axiosToastError';
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin.js'

const UserMenu = ({ close }) => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const response = await Axios({
                ...summaryApi.logout
            })

            if (response.data.success) {
                if (close) {
                    close()
                }
                dispatch(logout())
                localStorage.clear()
                toast.success(response.data.message)
                navigate('/')
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
    }

    const handleClose = () => {
        if (close) {
            close()
        }
    }

    return (
        <div>
            <div className='font-bold text-medium'>My Account</div>
            <div className='text-medium flex items-center gap-2 mt-1 text-tertiary-100'>
                <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} <span className='text-medium text-red-600'>{user.role == "Admin" ? "(Admin)" : ""}</span></span>
                <Link to={'/dashboard/profile'} onClick={handleClose} className='hover:text-tertiary-200 text-tertiary-100'>
                    <HiOutlineExternalLink size={16} />
                </Link>
            </div>

            <Divider />

            <div className='text-medium grid gap-1'>
                {
                    isAdmin(user.role) && (
                        <Link to={'/dashboard/category'} onClick={handleClose} className='px-2 hover:bg-orange-200 py-1'>Category</Link>
                    )
                }

                {
                    isAdmin(user.role) && (
                        <Link to={'/dashboard/subCategory'} onClick={handleClose} className='px-2 hover:bg-orange-200 py-1'>Sub Category</Link>
                    )
                }

                {
                    isAdmin(user.role) && (
                        <Link to={'/dashboard/upload-product'} onClick={handleClose} className='px-2 hover:bg-orange-200 py-1'>Upload Product</Link>
                    )
                }

                {
                    isAdmin(user.role) && (
                        <Link to={'/dashboard/product'} onClick={handleClose} className='px-2 hover:bg-orange-200 py-1'>Product</Link>
                    )
                }

                <Link to={'/dashboard/myorders'} onClick={handleClose} className='px-2 hover:bg-orange-200 py-1'>My Orders</Link>
                <Link to={'/dashboard/address'} onClick={handleClose} className='px-2 hover:bg-orange-200 py-1'>Save Address</Link>
                <button onClick={handleLogout} className='text-left px-2 hover:bg-orange-200 py-1'>Log Out</button>
            </div>
        </div >
    )
}

export default UserMenu
