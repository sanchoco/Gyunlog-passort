const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../../schemas/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

const kakaoStrategy = new KakaoStrategy(
	{
		clientID: process.env.KAKAO_CLIENT_ID,
		clientSecret: process.env.KAKAO_CLIENT_SECRET,
		callbackURL: '/auth/kakao/oauth'
	},
	function (accessToken, refreshToken, profile, done) {
		User.findOne(
			{
				id: profile.id,
				provider: 'kakao'
			},
			function (err, user) {
				if (!user) {
					user = new User({
						id: profile.id,
						password: bcrypt.hashSync(process.env.RANDOM_PWD, 10),
						nickname: profile.displayName,
						provider: 'kakao'
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

module.exports = kakaoStrategy;
