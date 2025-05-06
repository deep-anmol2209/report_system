import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
type: String,
default : "SuperAdmin"
  },
  isActive:{
    type: Boolean,
     default: true
  },
  permissions: { 
    type: [String], 
    default: ["manage_users", "manage_projects", "manage_plazas", "manage_issues", "configure_system"] 
  }
}, { timestamps: true });

// module.exports = mongoose.model("SuperAdmin", superAdminSchema);
const SuperAdmin= mongoose.model("SuperAdmin", superAdminSchema);

export default SuperAdmin;