import jwt from "jsonwebtoken"

import {dotenvVar} from '../config.js';

function authenticateToken(req, res, next) {
    console.log('middeleware');
    
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization header missing or invalid" });
        }
    
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) return res.status(401).json({message: "token missing"}); // Unauthorized
   console.log(token);
   
   
    jwt.verify(token, dotenvVar.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            
            return res.status(403).json({message: "invalid token please login again"})}; // Forbidden
            console.log(user);
            
        req.user = user; // Attach user details to the request object
        console.log(req.user);
        console.log("hello");
        
        next();
    });
}

export default authenticateToken