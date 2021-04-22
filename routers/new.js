const express = require('express');
const router = express.Router();
const Post = require('../schemas/posting');
const User = require('../schemas/user');
// XSS 방지
const sanitizeHtml = require('sanitize-html');
const path = require('path');

// 새로운 글 쓰기
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../') + '/views/new.html');
});

// 새글 작성 처리
router.post('/', async (req, res) => {
	const data = await req.body;

	if (!req.user) {
		res.json({ msg: 'fail' });
		return;
	}
	const title = sanitizeHtml(data['title']);
	const content = sanitizeHtml(data['content']);
	if (!(title && content)) {
		res.json({ msg: 'empty' });
		return;
	} else {
		const lasted = await Post.findOne().sort({ postId: -1 });
		let index = 1;
		if (lasted) {
			index = lasted['postId'] + 1;
		}
		await Post.create({
			postId: index,
			title: title,
			nickname: req.user.nickname,
			content: content,
			date: Date.now()
		});
		res.json({ msg: 'success' });
	}
});

module.exports = router;
