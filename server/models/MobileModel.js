import mongoose from "mongoose";

const MobileSchema = mongoose.Schema(
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

const Mobile = mongoose.model("Mobile", MobileSchema);

export default Mobile;
