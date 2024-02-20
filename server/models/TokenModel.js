import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    token: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now, 
      expires: 3600, // it Automatically Delete Token after 1 Hour
    },
  },
);

const Token = mongoose.model("Token", TokenSchema);
export default Token;