// passport
const bcrypt = require('bcrypt');
const User = require('../schemas/user');

const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findOne({ id }, (err, user) => {
		done(null, user);
	});
});

passport.use(
	new LocalStrategy(
		{
			usernameField: 'id',
			passwordField: 'password'
		},
		function (username, password, done) {
			User.findOne({ id: username }, (err, user) => {
				if (user) {
					bcrypt.compare(password, user.password, (err, same) => {
						if (same) {
							return done(null, user);
						} else {
							return done(null, false, { message: 'Incorrect password.' });
						}
					});
				} else {
					return done(null, false, { message: 'Incorrect ID' });
				}
			});
		}
	)
);
module.exports = { passport };
