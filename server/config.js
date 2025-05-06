import dotenv from "dotenv"
dotenv.config();
import SuperAdmin from "./model/superAdminModel.js";
import authEssentials from "./controller/index.js";




const dotenvVar= {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    SALT: process.env.SALT,
   ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    NODE_ENV: process.env.NODE_ENV
}

const init= async ()=>{
    try{
        const admin= await SuperAdmin.find();
        if(admin.length>0){
            console.log('SuperAdmin already exist');
         return            
        }

        const hash=  await authEssentials.createHash(dotenvVar.ADMIN_PASSWORD, dotenvVar.SALT)
  
      
          
          
          
          
        const newAdmin=  new SuperAdmin({
            username: dotenvVar.ADMIN_USERNAME,
            email: dotenvVar.ADMIN_EMAIL,
            password: hash
        })
        await newAdmin.save();

        // return res.status(201).json({message: "admin created successfully"})

    }catch(err){
        console.log(err);
    //    return res.status(500).json({message: "internal server error"})
        
    }
}

export { dotenvVar, init}