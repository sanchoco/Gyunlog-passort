const express = require('express');
const router = express.Router();

// 로그아웃 페이지
router.get('/', async (req, res) => {
	try {
		if (req.session) {
			req.session.destroy();
		}
		req.session.save(function () {
			res.redirect('/');
		});
	} catch (err) {
		res.redirect('/');
	}
});

module.exports = router;
