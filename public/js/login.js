// login.js
$(document).ready(function () {

});

function login() {
	let id = $('#id').val();
	let password = $('#password').val();

	$.ajax({
		type: 'POST',
		url: `/login`,
		data: {
			id: id,
			password: password
		},
		success: function (response) {
			if (response.msg == 'success') {
				alert('로그인 성공!');
				window.location.href = '/';
			} else if (response.msg == 'empty') {
				alert('빈 곳을 확인 해주세요.');
			} else if (response.msg == 'fail') {
				alert('아이디 또는 패스워드가 일치하지 않습니다.');
			} else {
				alert('에러! 다시 시도해주세요.');
			}
		}
	});
}
