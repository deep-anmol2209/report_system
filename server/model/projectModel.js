import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    PIU_Name: {type: String, required: true},
    location: {type: String, required: true, unique: true},
    projectName: { type: String, required: true, unique: true },
    isActive: {
     type : Boolean,
     default: true
    },
    plazas:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plaza"
    }],
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // Created by an Admin
  }, { timestamps: true });
  
//   module.exports = mongoose.model("Project", projectSchema);

const Project= mongoose.model('Project', projectSchema);
export default Project