import UserModel from '../models/user.model.js'

export const admin = async(req,res, next) => {
    try{
        const userId = req.userId
        const user = await UserModel.findById(userId)

        if(user.role !== 'Admin'){
            return res.json({
                message: 'Permission denied',
                error: true,
                success: false
            })
        }
        next()
    }
    catch(error){
        return res.status(500).json({
            message: "You are not allowed to access this",
            error: true,
            success: false
        })
    }
}