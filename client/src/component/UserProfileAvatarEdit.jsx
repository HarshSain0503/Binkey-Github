import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Axios from '../utils/Axios';
import summaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/axiosToastError";
import { updateAvatar } from "../store/userSlice";
import { IoClose } from "react-icons/io5";

const UserProfileAvatarEdit = ({close}) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleUploadAvatarImage = async (e) => {
        const file = e.target.files[0]
        
        if(!file){
            return
        }

        const formData = new FormData()
        formData.append('avatar', file)

        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.uploadAvatar,
                data: formData
            })
            const { data: responseData } = response
            dispatch(updateAvatar(responseData.data.avatar))
        }
        catch (error) {
            AxiosToastError(error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center">
            <div className="bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center">
            <button onClick={close} className="text-neutral-800 w-fit block ml-auto">
                <IoClose size={20} />
            </button>

                <div className="w-20 h-20 bg-black flex items-center justify-center rounded-full text-white overflow-hidden drop-shadow-md">
                    {
                        user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <FaRegUserCircle size={50} />
                        )
                    }
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="uploadProfile">
                        <div className="border cursor-pointer border-tertiary-200 hover:border-tertiary-100 hover:bg-tertiary-200 px-4 py-1 rounded text-sm my-3">
                            {
                                loading ? 'Loading...' : ' Upload'
                            }
                        </div>
                        <input onChange={handleUploadAvatarImage} type="file" id='uploadProfile' className="hidden" />
                    </label>
                </form>
            </div>
        </section>
    )
}

export default UserProfileAvatarEdit
