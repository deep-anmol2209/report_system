
import Admin from "../model/adminModel.js";
import SiteEngineers from "../model/siteEngineerModel.js";
import SuperAdmin from "../model/superAdminModel.js";
import ProjectIncharge from "../model/projectEngineerModel.js";
import authEssentials from "./index.js"
import { User } from "../model/user.js";
import jwt from "jsonwebtoken"
import { dotenvVar } from "../config.js";
import { response } from "express";


const authController= {
    login: async (req, res) => {
        const { email, password } = req.body;
        
        try {
            if (!email || !password) {
                return res.status(400).json({ message: "Credentials required" });
            }
    
            let user = null;
            let role = null;
    
            // Find user in different collections (exit early if found)
            if (!user) {
                const admin = await Admin.findOne({ email });
                if (admin) {
                    user = admin;
                    role = "Admin";
                }
            }
    
            if (!user) {
                const superAdmin = await SuperAdmin.findOne({ email });
                if (superAdmin) {
                    user = superAdmin;
                    role = "SuperAdmin";
                }
            }
    
            
    
            if (!user) {
                const siteEngineer = await User.findOne({ email });
                if (siteEngineer) {
                    user = siteEngineer;
                    role = user.currentRole;
                }
            }
    
            // If user is not found
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            console.log(user);
            
    
            // Check if password is correct
            const isMatch = await authEssentials.verifyPassword(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Incorrect password" });
            }
    
           
            const token = authEssentials.createToken({ user: user._id, role: role });
            const refreshToken = authEssentials.createRefreshToken({ user: user._id, role: role });
    
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,  
                secure: false,    
                maxAge: 7 * 24 * 60 * 60 * 1000, 
                sameSite: "Lax",
                path: "/"
            });
            console.log("Set-Cookie header sent:", refreshToken); // Debug log

            if(user.role=== "projectIncharge"){
                res.status(200).json({
                    message: "Login success",
                    token,
                    user: user._id,
                    role: role,
                    isEngineerAlso: user.isEngineerAlso
                });
            }
            else{
            res.status(200).json({
                message: "Login success",
                token,
                user: user._id,
                role: role,
                
            });}
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    refreshToken: async(req, res)=>{
        try {
            console.log("Cookies received:", req.cookies); // Debugging

            const refresh_token = req.cookies.refreshToken;
            console.log(refresh_token);
            
            if (!refresh_token) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            jwt.verify(refresh_token, dotenvVar.REFRESH_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid or expired refresh token" });
                }

                const new_accessToken = authEssentials.createToken({ user: decoded.user, role: decoded.role });

                return res.status(200).json({ 
                    accesstoken: new_accessToken, 
                    expiresAt: Date.now() + 2 * 60 * 1000,
                });
            });
        } catch (err) {
            console.error("Error refreshing token:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}

export default authController
