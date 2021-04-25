const LocalStrategy = require('passport-local').Strategy;
const User = require('../../schemas/user');
const bcrypt = require('bcrypt');

const localStrategy = new LocalStrategy(
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
);

module.exports = localStrategy;
