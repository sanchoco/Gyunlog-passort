const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');
// XSS 방지
const sanitizeHtml = require('sanitize-html');
// 시간 표기 설정
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

router.get('/:postId', async (req, res) => {
	const id = req.params.postId;
	comments = await Comment.find({ postId: id }).sort({ commentId: -1 });
	let userNickname;
	try {
		if (req.user) userNickname = req.user.nickname;
	} catch (err) {}

	let data = [];
	for (i in comments) {
		const commentId = comments[i]['commentId'];
		const postId = comments[i]['postId'];
		const nickname = comments[i]['nickname'];
		const date = moment(comments[i]['date']).format('MM/DD HH:mm');
		const comment = comments[i]['comment'];
		let permission = 0;
		if (userNickname == comments[i]['nickname']) permission = 1;
		data.push({ commentId, postId, nickname, date, comment, permission });
	}
	res.json(data);
});

// 새 댓글 작성
router.post('/:postId', async (req, res) => {
	const id = req.params.postId;
	const data = await req.body;
	const user = req.user;
	if (!data.comment) {
		res.json({ msg: 'empty' });
		return;
	}
	if (!user) {
		res.json({ msg: 'fail' });
		return;
	}
	let index = 1;
	const lasted = await Comment.findOne().sort({ commentId: -1 });
	if (lasted) {
		index = lasted['commentId'] + 1;
	}
	try {
		await Comment.create({
			commentId: index,
			comment: sanitizeHtml(data.comment),
			postId: id,
			nickname: user.nickname,
			date: Date.now()
		});
		res.json({ msg: 'success' });
	} catch (err) {
		res.json({ msg: 'fail' });
	}
});

// 댓글 수정
router.put('/:commentId', async (req, res) => {
	const commentId = req.params.commentId;
	const data = await req.body;
	if (!data.comment) {
		res.json({ msg: 'empty' });
		return;
	}
	try {
		const user = req.user;
		const comment = await Comment.findOne({ commentId }, { nickname: true });
		if (user.nickname == comment.nickname) {
			await Comment.updateOne({ commentId }, { comment: data.comment });
			res.json({ msg: 'success' });
			return;
		}
	} catch (err) {}
	res.json({ msg: 'fail' });
});

// 댓글 삭제
router.delete('/:commentId', async (req, res) => {
	const commentId = req.params.commentId;
	try {
		const user = req.user;
		const comment = await Comment.findOne({ commentId }, { nickname: true });
		if (user.nickname == comment.nickname) {
			await Comment.deleteOne({ commentId });
			res.json({ msg: 'success' });
			return;
		}
	} catch (err) {}
	res.json({ msg: 'fail' });
});

module.exports = router;
