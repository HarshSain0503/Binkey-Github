import { useDispatch, useSelector } from "react-redux"
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from "../component/UserProfileAvatarEdit";
import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/axiosToastError";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";

const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit, setOpenProfileAvatarEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [userData, setUserData] = useState({
        name: user.name,
        mobile: user.mobile,
        email: user.email,
    });

    useEffect(() => {
        setUserData({
            name: user.name,
            mobile: user.mobile,
            email: user.email,
        });
    }, [user]);

    const handleOnchange = (e) => {
        const { name, value } = e.target

        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.updateUserDetails,
                data: userData
            })

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data));
            }
        }
        catch (error) {
            AxiosToastError(error)
        }
        finally {
            setLoading(false)
        }
    };


    return (
        <div className="p-4">
            {/* Profile upload and display image */}
            <div className="w-20 h-20 bg-black flex items-center justify-center rounded-full text-white overflow-hidden drop-shadow-md">
                {
                    user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <FaRegUserCircle size={50} />
                    )
                }
            </div>

            <button onClick={() => setOpenProfileAvatarEdit(true)} className="text-sm min-w-20 border border-tertiary-200 hover:border-tertiary-100 hover:bg-tertiary-200 px-3 py-1 rounded-full mt-3 hover:text-black">
                Edit
            </button>

            {
                openProfileAvatarEdit && (
                    <UserProfileAvatarEdit close={() => setOpenProfileAvatarEdit(false)} />
                )
            }

            {/* name, mobile, email, change password */}
            <form className="my-4 grid gap-4" onSubmit={handleSubmit}>
                <div className="grid">
                    <label htmlFor="name"> Name </label>
                    <input type="text" id="name" placeholder="Enter your name" className="p-2 bg-blue-50 outline-none border
                    focus-within:border-tertiary-200 rounded mt-2"
                        value={userData.name} name="name" onChange={handleOnchange} required
                    />
                </div>

                <div className="grid">
                    <label htmlFor="email"> Email </label>
                    <input type="email" id="email" placeholder="Enter your email" className="p-2 bg-blue-50 outline-none border
                    focus-within:border-tertiary-200 rounded mt-2"
                        value={userData.email} name="email" onChange={handleOnchange} required
                    />
                </div>

                <div className="grid">
                    <label htmlFor="mobile"> Mobile-Number </label>
                    <input type="text" id="mobile" placeholder="Enter your mobile number" className="p-2 bg-blue-50 outline-none border
                    focus-within:border-tertiary-200 rounded mt-2"
                        value={userData.mobile} name="mobile" onChange={handleOnchange} required
                    />
                </div>

                <button className="border-tertiary-200 hover:border-tertiary-100 px-4 py-2 font-semibold
                hover:bg-tertiary-200 border text-tertiary-200 hover:text-black rounded">
                    {
                        loading ? "Loading..." : "Submit"
                    }
                </button>
            </form>
        </div>
    )
}

export default Profile
