const express = require('express');
const router = express.Router();
const path = require('path');

// 로그인 페이지
router.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../') + '/views/login.html');
});

const { passport } = require('../lib/passport');
// 로그인 인증 요청
router.post(
	'/',
	passport.authenticate('local', {
		failureRedirect: '/login'
	}),
	(req, res) => {
		req.session.save(() => {
			res.redirect('/');
		});
	}
);

module.exports = router;
