import { useState } from "react"
import { useSelector } from "react-redux"
import AddAddress from "../component/AddAddress"
import { MdDelete, MdEdit } from "react-icons/md"
import EditAddressDetails from "../component/EditAddressDetails"
import AxiosToastError from "../utils/axiosToastError"
import Axios from "../utils/Axios"
import summaryApi from "../common/summaryApi"
import toast from "react-hot-toast"
import { useGlobalContext } from "../provider/GlobalProvider"

const Address = ({ close }) => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddress, setOpenAddress] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState(false)
  const { fetchAddress } = useGlobalContext()

  const handleDisableAddress = async (_id) => {
    try {
      const response = await Axios({
        ...summaryApi.disableAddress,
        data: {
          _id: _id
        }
      })

      if (response.data.success) {
        toast.success("Address removed successfully")
        if (fetchAddress) {
          fetchAddress()
        }
      }
    }
    catch (error) {
      AxiosToastError(error)
    }
  }


  return (
    <div className="">
      <div className="bg-white shadow-lg p-2 flex justify-between gap-4 items-center">
        <h2 className="font-semibold">Address</h2>

        <button onClick={() => setOpenAddress(true)} className="border border-tertiary-200 hover:border-tertiary-100 hover:bg-tertiary-200 font-semibold text-sm px-3 py-1 rounded">
          Add Address
        </button>
      </div>

      <div className="p-2 grid gap-5 bg-blue-50 mt-2">
        {
          addressList.map((address, index) => {
            return (
              <div key={address + index} className={`border rounded p-3 flex gap-3 bg-white ${!address.status && "hidden"}`}>
                <div className="w-full">
                  <p>{address.address_line}</p>
                  <p>{address.city}</p>
                  <p>{address.state}</p>
                  <p>{address.country} - {address.pincode}</p>
                  <p>{address.mobile}</p>
                </div>

                <div className="grid gap-12">
                  <button onClick={() => {
                    setOpenEdit(true)
                    setEditData(address)
                  }} className="bg-green-200 p-1 mt-2 rounded hover:text-white hover:bg-green-600"><MdEdit size={18} /></button>
                  <button onClick={() => handleDisableAddress(address._id)} className="bg-red-200 p-1 mb-2 rounded hover:text-white hover:bg-red-600"><MdDelete size={18} /></button>

                </div>
              </div>
            )
          })
        }
        <div onClick={() => setOpenAddress(true)} className="h-16 bg-blue-50 cursor-pointer border-2 border-dashed border-gray-300 flex justify-center items-center">
          Add Address
        </div>
      </div>

      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }

      {
        openEdit && (
          <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
        )
      }
    </div>
  )
}

export default Address
