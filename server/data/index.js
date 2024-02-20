import mongoose from "mongoose";

const userIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const users = [
	{
		_id: userIds[0],
		firstName: "test",
		lastName: "me",
		email: "aaaaaaa@gmail.com",
		password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
		picturePath: "p11.jpeg",
		createdAt: 1115211422,
		updatedAt: 1115211422,
		__v: 0,
	}, 
];

export const webs = [
	{
		_id: userIds[0],
		title: 'EC Torres Medical Clinic',
		desciption: 'A Service Company that Provide Medical Service to All Manpower Businesses Across Metro Manila',
		category: 'client',
		type: 'static',
		imgCover: "cover",
		images: [ "img1", "img2", "img3", "img4", "img5", "img6" ],
		feature: {
				feature1: [ 'List 1', 'List 2', 'List 3', 'List 4' ] ,
				feature2: [ 'List 1', 'List 2', 'List 3', 'List 4' ] ,
				feature3: [ 'List 1', 'List 2', 'List 3', 'List 4' ] ,
		},
		url: 'https://github.com/JomJom789',
	}
];

export const mobiles = [
	{
		_id: userIds[0],
		title: '',
		desciption: '',
		category: 'demo',
		imgCover: null,
		images: [],
		feature: {
				feature1: [ 'List 1', 'List 2', 'List 3', 'List 4' ] ,
				feature2: [ 'List 1', 'List 2', 'List 3', 'List 4' ] ,
				feature3: [ 'List 1', 'List 2', 'List 3', 'List 4' ] ,
		},
		url: '',
	},
];