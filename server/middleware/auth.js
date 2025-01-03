import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req?.headers?.authorization?.split('')[1]

        if (!token) {
            return res.status(401).json({
                message: 'You are not logged in. Please log in to continue',
                error: true,
                success: false
            })
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

        if (!decode) {
            return res.status(401).json({
                message: 'Unauthorized Access, Please log in to continue',
                error: true,
                success: false
            })
        }

        req.userId = decode.id

        next();
    }
    catch (error) {
        res.status(500).json({
            message: "Please Login first",
            error: true,
            success: false
        })
    }
}

export default auth;