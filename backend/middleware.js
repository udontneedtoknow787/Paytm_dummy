const { JWT_SECRET } = require("./routes/config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return res.status(403).json({
    //         message: "inavlid authorization"
    //     });
    // }

    // const token = authHeader.split(' ')[1];
    const token = authHeader;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;
        console.log("jwt decoded");

        next();
    } catch (err) {
        return res.status(403).json({
            message: "middleware rejected"
        });
    }
};

module.exports = {
    authMiddleware
}