// new.js
// index.js
$(document).ready(function () {

});

function posting() {
	let title = $('#title').val();
	let content = $('#content').val();

	$.ajax({
		type: 'POST',
		url: `/new`,
		data: {
			title: title,
			content: content
		},
		success: function (response) {
			console.log(response);
			if (response.msg == 'success') {
				alert('등록 완료!');
				window.location.href = '/';
			} else if (response.msg == 'empty') {
				alert('빈 곳을 확인 해주세요.');
			} else {
				alert('잘못된 접속입니다. 다시 로그인 하세요.');
				logout();
			}
		},
		error: function (xhr, textStatus, error) {
			alert(xhr.responseJSON.message);
			window.location.href = '/';
		}
	});
}
