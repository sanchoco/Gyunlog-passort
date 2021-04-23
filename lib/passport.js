// passport
const bcrypt = require('bcrypt');
const User = require('../schemas/user');
require('dotenv').config()

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const NaverStrategy = require('passport-naver').Strategy;

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findOne({ id }, (err, user) => {
		done(null, user);
	});
});

// 기본 정책
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

passport.use(
	new NaverStrategy(
		{
			clientID: process.env.NAVER_CLIENT_ID,
			clientSecret: process.env.NAVER_SECRET,
			callbackURL: '/auth/naver/callback'
		},
		function (accessToken, refreshToken, profile, done) {
			User.findOne(
				{
					id: profile.id
				},
				function (err, user) {
					console.log(user);
					if (!user) {
						user = new User({
							id: profile.id,
							password: bcrypt.hashSync(process.env.NAVER_RANDOM, 10),
							nickname: profile.displayName,
							social: 'naver'
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
	)
);

module.exports = { passport };
