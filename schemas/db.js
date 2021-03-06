const mongoose = require('mongoose');
require('dotenv').config();
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		ignoreUndefined: true,
		user: process.env.MONGO_USER,
		pass: process.env.MONGO_PASS
	})
	.catch((err) => console.error(err));


mongoose.connection.on('error', (err) => {
	console.error('몽고디비 연결 에러', err);
});

module.exports = mongoose;
