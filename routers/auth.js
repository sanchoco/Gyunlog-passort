const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('../lib/passport');

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
		res.redirect('/');
	}
);

// 로그아웃
router.get('/logout', async (req, res) => {
	try {
		if (req.session) {
			req.session.destroy();
		}
		res.redirect(req.headers.referer);
	} catch (err) {
		res.redirect(req.headers.referer);
	}
});

// 네이버 로그인
router.get('/naver', passport.authenticate('naver', { failureRedirect: '/auth' }));

// 네이버 콜백
router.get('/naver/oauth', passport.authenticate('naver', { failureRedirect: '/auth', successRedirect: '/' }));

// 구글 로그인
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], failureRedirect: '/auth' }));

// 구글 콜백
router.get('/google/oauth', passport.authenticate('google', { failureRedirect: '/auth', successRedirect: '/' }));

module.exports = router;
