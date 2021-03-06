const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new Schema({
	id: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	nickname: { type: String, required: true },
	provider: { type: String }
});

module.exports = mongoose.model('User', user);
