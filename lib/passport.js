// passport
const User = require('../schemas/user');
const passport = require('passport');

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(function (id, done) {
	User.findOne({ _id: id }, (err, user) => {
		done(null, user);
	});
});

// 로그인 전략
passport.use(require('./auth/local'));
passport.use(require('./auth/naver'));
passport.use(require('./auth/google'));

module.exports = passport;
