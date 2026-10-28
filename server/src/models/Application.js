import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  location: { type: String, default: "" },
  jobUrl: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Applied", "Interview", "Offer", "Rejected"],
    default: "Applied"
  },
  appliedDate: { type: Date, default: Date.now },
  notes: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
