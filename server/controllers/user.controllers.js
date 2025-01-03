import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../config/sendEmail.js';
import generateAccessToken from '../utils/generateAccessToken.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';
import dotenv from 'dotenv';
import generateOtp from '../utils/generateOtp.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
dotenv.config();

export async function registerUserController(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Provide name, email and password',
                error: true,
                success: false
            })
        }

        const User = await UserModel.findOne({ email })
        if (User) {
            return res.json({
                message: 'Email already exists',
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new UserModel(payload);
        const save = await newUser.save();

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: 'Confirm your email',
            html: verifyEmailTemplate({
                name,
                url: verifyEmailUrl
            })
        })

        return res.json({
            message: 'User registered successfully',
            error: false,
            success: true,
            data: save
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

export async function verifyEmailController(req, res) {
    try {
        const { code } = req.body
        const user = await UserModel.findOne({ _id: code })

        if (!user) {
            return res.status(400).json({
                message: 'Invalid code',
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.updateOne({ _id: code }, {
            verify_email: true
        })

        return res.json({
            message: 'Email verified successfully',
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

// Login Controller
export async function loginController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: 'Provide email and password',
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: 'User not register',
                error: true,
                success: false
            })
        }

        if (user.status !== "Active") {
            return res.status(400).json({
                message: 'Your account is not active',
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password)
        if (!checkPassword) {
            return res.status(400).json({
                message: 'Invalid password',
                error: true,
                success: false
            })
        }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date : new Date()
        })

        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.cookie('accessToken', accessToken, cookiesOptions);
        res.cookie('refreshToken', refreshToken, cookiesOptions);

        return res.json({
            message: 'User logged in successfully',
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken
            }
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

// Logout Controller
export async function logoutController(req, res) {
    try {
        const userId = req.userId; //middleware

        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.clearCookie("accessToken", cookiesOptions);
        res.clearCookie("refreshToken", cookiesOptions);

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
            refresh_token: ""
        })

        return res.json({
            message: 'User logged out successfully',
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

// Upload User Avatar
export async function uploadAvatar(req, res) {
    try {
        const userId = req.userId // auth middleware
        const image = req.file // multer middleware

        const upload = await uploadImageCloudinary(image)

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })

        return res.json({
            message: 'Avatar profile uploaded successfully',
            data: {
                _id: userId,
                avatar: upload.url
            },
            success: true,
            error: false
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

// Update User Details
export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId;
        const { name, email, mobile, password } = req.body;

        let hashedPassword = ""

        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashedPassword = await bcryptjs.hash(password, salt);
        }

        const updateUser = await UserModel.updateOne({ _id: userId }, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashedPassword })
        })

        return res.json({
            message: 'User details updated successfully',
            error: false,
            success: true,
            data: updateUser
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

// Forgot Password Controller
export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: 'Email not found',
                error: true,
                success: false
            })
        }

        const otp = generateOtp();
        const expireTime = new Date() + 15 * 60 * 1000 //15min

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry_date: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo: email,
            subject: 'Reset Password OTP from Binkey    ',
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return res.json({
            message: 'OTP sent to your email',
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

// verify forgot password otp
export async function verifyForgotPassword(req, res) {
    try {
        const { email, otp } = req.body;
        if (!email, !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required',
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: 'Email not found',
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString();
        if (user.forgot_password_expiry_date < currentTime) {
            return res.status(400).json({
                message: 'OTP expired',
                error: true,
                success: false
            })
        }

        if (otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message: 'Invalid OTP',
                error: true,
                success: false
            })
        }

        // if otp is not expired or otp === user.forgot_password_otp
        const updateUser  = await UserModel.findByIdAndUpdate(user?._id, {
            forgot_password_otp: "",
            forgot_password_expiry_date: ""
        })

        return res.json({
            message: 'OTP verified successfully',
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

// Reset the password
export async function resetPassword(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: 'Email, new password and confirm password are required',
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Email not found',
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'New Password and Confirm Password are not match',
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        const update = await UserModel.findOneAndUpdate(user._id, {
            password: hashedPassword
        })

        return res.json({
            message: 'Password update successfully',
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

// Refresh token Controller
export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split('')[1]

        if(!refreshToken){
            return res.status(401).json({
                message: 'Invalid refresh token',
                error: true,
                success: false
            })
        }
       
        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
        
        if(!verifyToken){
            return res.status(401).json({
                message: 'Refresh token is expired',
                error: true,
                success: false
            })
        }

        console.log("verifyToken: ",verifyToken);
        const userId = verifyToken?._id

        const newAccessToken = await generateAccessToken(userId)

        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.cookie('accessToken', newAccessToken, cookiesOptions) 

        return res.json({
            message: 'New Access token generated successfully',
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
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

// Get login user details
export async function userDetails(req, res) {
    try{
        const userId = req.userId
        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return res.json({
            message: 'User details fetched successfully',
            data: user,
            error: false,
            success: true,
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