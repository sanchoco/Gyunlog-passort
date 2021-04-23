const express = require('express');
const router = express.Router();
const path = require('path');
const { passport } = require('../lib/passport');
require('dotenv').config();
// 로그인 페이지
router.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../') + '/views/login.html');
});

// 로그인 인증 요청
router.post(
	'/login',
	passport.authenticate('local', {
		failureRedirect: '/auth'
	}),
	(req, res) => {
		req.session.save(() => {
			res.redirect('/');
		});
	}
);

// 로그아웃
router.get('/logout', async (req, res) => {
	try {
		if (req.session) {
			req.session.destroy();
		}
		req.session.save(function () {
			res.redirect(req.headers.referer);
		});
	} catch (err) {
		res.redirect(req.headers.referer);
	}
});

// 네이버 로그인
router.get(
	'/naver',
	passport.authenticate('naver', null, (req, res) => {
		res.redirect('/auth');
	})
);

// 네이버 콜백
router.get('/naver/callback', passport.authenticate('naver', { failureRedirect: '/auth', successRedirect: '/' }));

module.exports = router;
