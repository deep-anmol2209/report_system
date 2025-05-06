import mongoose from "mongoose";

const projectInchargeSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNO: { type: Number, required: true, unique: true },
    isActive: { type: Boolean, default: true },  // ✅ Fixed field name
    role: { type: String, default: "projectIncharge" },
    isEngineerAlso: {
        type: Boolean,
        default : false
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        homeAddress: { type: String, required: true }
    },
    manageIssues: [{
        issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" }
    }],
    assignedProject: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

    // ✅ Corrected assignedBy with refPath
    assignedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: "assignedByModel",  // Dynamically references either "Admin" or "SuperAdmin"
        required: true
    },

    assignedByModel: { 
        type: String, 
        enum: ["Admin", "SuperAdmin"],  // ✅ Fixed enum capitalization
        required: true 
    },

    permissions: {
        type: [String],
        default: ["manage_project", "manage_plazas", "view_issues", "resolve_issues"]
    }
}, { timestamps: true });

const ProjectIncharge = mongoose.model("ProjectIncharge", projectInchargeSchema);
export default ProjectIncharge;
