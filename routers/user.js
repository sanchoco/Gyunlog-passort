const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
	if (req.user) {
		res.json({ nickname: req.user.nickname });
	} else {
		res.status(401).json({ msg: 'fail' });
	}
});

module.exports = router;
