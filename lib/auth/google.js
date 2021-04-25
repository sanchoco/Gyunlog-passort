const User = require('../../schemas/user');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const googleStrategy = new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: '/auth/google/oauth'
	},
	function (accessToken, refreshToken, profile, cb) {
		User.findOne(
			{
				id: profile.id
			},
			function (err, user) {
				if (!user) {
					user = new User({
						id: profile.id,
						password: bcrypt.hashSync(process.env.RANDOM_PWD, 10),
						nickname: profile.displayName + '(google)',
						provider: 'google'
					});
					try {
						user.save(function (err) {
							if (err) console.log(err);
							return cb(err, user);
						});
					} catch {
						return cb(err, false);
					}
				} else {
					return cb(err, user);
				}
			}
		);
	}
);

module.exports = googleStrategy;
