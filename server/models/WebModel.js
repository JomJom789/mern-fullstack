import mongoose from "mongoose";

const WebSchema = mongoose.Schema(
  {
    userId: {
			type: String,
			required: true,
    },
    title: {
			type: String,
			required: true,
    },
    description: {
			type: String,
			required: true,
    },
    category: {
			type: String,
			required: true,
    },
    type: {
			type: String,
			required: true,
    },
    imgCover: {
			type: String,
			default: "",
    },
    images: {
			type: Array,
			default: [],
    }, 
    features: {
      type: Array,
			default: [],
    },
    url: {
			type: String,
			default: "",
    },
    genres: {
			type: Array,
			default: [],
    },
  },
  { timestamps: true }
);

const Web = mongoose.model("Web", WebSchema);

export default Web;
