
import mongoose from "mongoose";

const plazaSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  plazaName: { type: String, required: true, unique: true },
  isActive:{
    type: Boolean,
    default : true
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }

  ], // Site Engineer  
}, { timestamps: true });

//   module.exports = mongoose.model("Plaza", plazaSchema);
const Plaza = mongoose.model('Plaza', plazaSchema);

export default Plaza;