import mongoose from "mongoose";



const siteEngineerSchema = new mongoose.Schema({

    firstName: {
     type: String,
     required: true,
     trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    isActive:{
        type: Boolean,
        default : true
    },
    role: {
      type: String,
     enum:  ["plaza_incharge", "site_engineer"]
     
    },
    phoneNO: {
type : Number,
required : true,
unique: true
    },
    address: {
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      
      homeAddress:{
        type : String,
        required: true
      }
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    assignedPlaza: { type: mongoose.Schema.Types.ObjectId, ref: "Plaza" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectIncharge" },
    permissions: { 
      type: [String], 
      default: ["report_issues", "view_issues"] 
    }
  }, { timestamps: true });
  
const SiteEngineer= mongoose. model('SiteEngineer', siteEngineerSchema);

export default SiteEngineer
  