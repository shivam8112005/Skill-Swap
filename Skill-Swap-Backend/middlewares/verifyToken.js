import jwt from 'jsonwebtoken'

 const verifyToken = (req, res, next) => {
console.log(req.headers.cookie)
    const token = req.cookies.token
    console.log(token);
    
    if (!token) {
        throw new Error(401, 'Unautorized')
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('error in mw');
            
            return new Error(401, 'Unauthorized')
        }
        console.log(user);
        
        req.user = user
        next()
    })
}
export default verifyToken;