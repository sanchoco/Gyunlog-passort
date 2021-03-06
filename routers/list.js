const express = require('express');
const router = express.Router();
const Post = require('../schemas/posting');
const Comment = require('../schemas/comment');
// XSS 방지
const sanitizeHtml = require('sanitize-html');
// 시간 표기 설정
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

// 메인 페이지 글 리스트
router.get('/', async (req, res) => {
	const post = await Post.find().sort({ date: -1 }).select('postId title nickname date');
	let data = [];
	for (i in post) {
		const postId = post[i]['postId'];
		const date = moment(post[i]['date']).format('MM/DD HH:mm:ss');
		const title = post[i]['title'];
		const nickname = post[i]['nickname'];
		data.push({ postId, date, title, nickname });
	}
	res.json(data);
});

// 상세 페이지 정보 가져오기
router.get('/:postId', async (req, res) => {
	const postId = req.params.postId;
	const post = await Post.findOne({ postId: postId }).select('postId title nickname content date');
	let user;
	let permission = 0; // 프론트 수정,삭제 버튼을 표시하기 위한 변수
	try {
		user = req.user;
		if (user && user.nickname == post['nickname']) permission = 1;
	} catch (err) {
		console.log('상세페이지 로그인 x');
	}

	const data = {
		postId: postId,
		title: sanitizeHtml(post['title']),
		nickname: sanitizeHtml(post['nickname']),
		content: sanitizeHtml(post['content']),
		date: moment(post['date']).format('MM/DD HH:mm:ss'),
		permission: permission
	};
	res.json(data);
});

// 게시글 수정 요청
router.put('/:id/update', async (req, res) => {
	const id = req.params.id;
	const user = req.user;
	try {
		const post = await Post.findOne({ postId: id });
		if (!user || user.nickname != post.nickname) {
			res.json({ msg: 'fail' });
			return;
		}
		const data = req.body;
		const title = sanitizeHtml(data['title']);
		const content = sanitizeHtml(data['content']);
		if (!(title && content)) {
			res.json({ msg: 'empty' });
			return;
		}
		await Post.updateOne(
			{ postId: id },
			{
				title: title,
				content: content
			}
		);
		res.json({ msg: 'success' });
	} catch {
		res.json({ msg: 'fail' });
	}
});

// 게시글 삭제 처리
router.delete('/:postId', async (req, res) => {
	const id = req.params.postId;
	const user = req.user;
	try {
		const post = await Post.findOne({ postId: id });
		if (!user && user.nickname != post.nickname) {
			res.json({ msg: 'fail' });
			return;
		}

		await Comment.deleteMany({ postId: id }).catch();

		await Post.deleteOne({ postId: id })
			.then(() => {
				res.json({ msg: 'success' });
			})
			.catch(() => {
				res.json({ msg: 'fail' });
			});
	} catch (err) {
		res.json({ msg: 'fail' });
	}
});

module.exports = router;
