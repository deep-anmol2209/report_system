import mongoose from "mongoose";


const issueSchema = new mongoose.Schema({
 
  issueId: { type: String, required: true, unique: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'reportedByModel' },
  reportedByModel: { type: String, required: true, enum: ["User"] },
  
  description: { type: String, required: true },
  plazaId: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "Plaza"
  },
  problemType: { type: String, enum: ['Software', 'Hardware', 'Unknown'], required: true },
  issueTime: { type: Date, default: Date.now },
 
  // Rectified info
  rectifiedBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'rectifiedByModel' },
  rectifiedByModel: { type: String, enum: ['Admin', "User"] },
  remarks: {type : String, trim: true },
  rectifiedTime: { type: Date },
  status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
}, { timestamps: true });




const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
