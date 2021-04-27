const mongoose = require('mongoose');



const MessageSchema = new mongoose.Schema({
	username: String,

	roomid: String,

	from: {
		type: String,
		default: '',
	},
	message: {
		type: String,
		default: '',
	},
	time: {
		type: Date,
		default: Date.now(),
	},
});
MessageSchema.statics = {
	fetch: function (cb) {
		return this.find({}).sort('time').exec(cb);
	},
	findById: function (id, cb) {
		return this.findOne({ _id: id }).exec(cb);
	},
};

const Messages = mongoose.model('Messages', MessageSchema);

module.exports = Messages;
