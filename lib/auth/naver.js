const NaverStrategy = require('passport-naver').Strategy;
const User = require('../../schemas/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

const naverStrategy = new NaverStrategy(
	{
		clientID: process.env.NAVER_CLIENT_ID,
		clientSecret: process.env.NAVER_CLIENT_SECRET,
		callbackURL: '/auth/naver/oauth'
	},
	function (accessToken, refreshToken, profile, done) {
		User.findOne(
			{
				id: profile.id,
				provider: 'naver'
			},
			function (err, user) {
				if (!user) {
					user = new User({
						id: profile.id,
						password: bcrypt.hashSync(process.env.RANDOM_PWD, 10),
						nickname: profile.displayName,
						provider: 'naver'
					});
					try {
						user.save(function (err) {
							if (err) console.log(err);
							return done(err, user);
						});
					} catch {
						return done(err, false);
					}
				} else {
					return done(err, user);
				}
			}
		);
	}
);

module.exports = naverStrategy;
