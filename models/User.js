const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	facebookId: { type: String },
	googleId: { type: String },
	name: {
		type: String,
	},
	email: {
		type: String,
	},
	password: {
		type: String,
	},

	DOB: {
		type: String,
	},
	age: {
		type: String,
	},
	gender: {
		type: String,
	},
	hobby: {
		type: String,
	},
	school: {
		type: String,

		default: '',
	},
	job: {
		type: String,
		default: '',
	},
	info: {
		type: String,

		default: '',
	},

	img: { data: String, contentType: String },
	img2: { data: String, contentType: String },
	img3: { data: String, contentType: String },
	img4: { data: String, contentType: String },
	img5: { data: String, contentType: String },
	date: {
		type: Date,
		default: Date.now,
	},
	gender_pref: {
		type: String,

		default: 'All',
	},
	hobby_pref: {
		type: String,

		default: '',
	},
	min_age: {
		type: String,

		default: '18',
	},
	max_age: {
		type: String,

		default: '70',
	},
	max_distance: {
		type: String,
	},

	longitude: { type: String },
	latitude: { type: String },

	rooms: [
		{
			room: String,
		},
	],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
