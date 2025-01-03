import Axios from '../utils/Axios'
import summaryApi from '../common/summaryApi'

const uploadImage = async(image) => {
    try{
        const formData = new FormData()
        formData.append('image',image)

        const response = await Axios({
            ...summaryApi.uploadImage,
            data : formData
        })
        return response
    }
    catch(error){
        console.log(error)
    }
}

export default uploadImage