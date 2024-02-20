import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
			type: String,
			required: true,
			min: 2,
			max: 50,
    },
    lastName: {
			type: String,
			required: true,
			min: 2,
			max: 50,
    },
    email: {
			type: String,
			required: true,
			max: 50,
			unique: true,
    },
    password: {
			type: String,
			required: true,
			min: 5,
    },
		role: {
			type: String,
			default: "admin",
    },
    picturePath: {
			type: String,
			default: "",
    },
		type: {
			type: String,
			default: "",
    },
		activated: {
			type: Boolean,
			default: false,
    },
		activeStatus: {
			type: Boolean,
			default: false,
    },
		fields: {
			type: Array,
			default: [],
    },
		followers: {
			type: Array,
			default: [],
		},
		following: {
			type: Array,
			default: [],
		},
  },
  { timestamps: true }
);

UserSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id },
		process.env.JWTPRIVATEKEY,
		{expiresIn: "7d",}
	);
	return token;
};

// const validate = (data) => {
// 	const schema = Joi.object({
// 		firstName: Joi.string().required().label("First Name"),
// 		lastName: Joi.string().required().label("Last Name"),
// 		email: Joi.string().email().required().label("Email"),
// 		password: passwordComplexity().required().label("Password"),
// 	});
// 	return schema.validate(data);
// };

const User = mongoose.model("User", UserSchema);
export default User ;
