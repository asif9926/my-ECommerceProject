import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: "YYYY-MM-DD"
  count: { type: Number, default: 0 },
});

const Visitor = mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);
export default Visitor;