// register.js

function register() {
	let id = $('#id').val();
	let password = $('#password').val();
	let password_re = $('#password_re').val();
	let nickname = $('#nickname').val();
	let success = false;
	$.ajax({
		type: 'POST',
		url: `/register`,
		data: {
			id: id,
			password: password,
			password_re: password_re,
			nickname: nickname
		},
		success: function (response) {
			if (response.msg == 'success') {
				alert('회원가입 완료!');
				success = true;
				window.location.href = '/auth';
			} else if (response.msg == 'empty') {
				alert('빈 곳을 확인 해주세요.');
			} else if (response.msg == 'wrong_id') {
				alert('사용할 수 없는 아이디입니다. 다시 확인해주세요.');
			} else if (response.msg == 'wrong_nickname') {
				alert('사용할 수 없는 닉네임입니다. 다시 확인해주세요.');
			} else if (response.msg == 'wrong_password') {
				alert('사용할 수 없는 비밀번호입니다. 다시 확인해주세요.');
			} else if (response.msg == 'already_id') {
				alert('이미 존재하는 아이디입니다.');
			} else if (response.msg == 'already_nickname') {
				alert('이미 존재하는 닉네임입니다.');
			} else if (response.msg == 'diff_password') {
				alert('두 비밀번호가 일치하지 않습니다.');
			} else {
				alert('에러! 다시 시도해주세요.');
			}
		}
	});
	if (success) {
		window.location.href = '/auth';
	}
}
