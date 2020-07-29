const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "this-secret-string-is-used-to-validate-our-token");
        req.userData = {email: decodedToken.email, userId: decodedToken.UserId };
        next();
    } catch (error) {
       res.status(401).json({
           message: "Not authenticated!"
       }) 
    }
}