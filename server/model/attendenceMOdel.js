import mongoose from "mongoose";


const AttendanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['present', 'absent', 'leave'], required: true },
    markedBy: { type: String, enum: ['user', 'admin'], required: true },
    lastUpdated: { type: Date, default: Date.now }
  });

  const attendenceModel= mongoose.model('attendance', AttendanceSchema);
  export default attendenceModel