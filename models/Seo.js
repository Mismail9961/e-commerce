import mongoose from "mongoose";

const openGraphSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    url: { type: String, default: "" },
    siteName: { type: String, default: "" },
    locale: { type: String, default: "en_US" },
    type: { type: String, default: "website" },
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: { type: [String], default: [] },
  openGraph: { type: openGraphSchema, default: {} },
});

export default mongoose.models.Seo || mongoose.model("Seo", seoSchema);
