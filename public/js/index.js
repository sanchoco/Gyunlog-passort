// index.js
$(document).ready(function () {
	$('#contents').empty();

	show_list();

	$.ajax({
		type: 'get',
		url: `/user`,
		success: (response) => {
			let nickname = response.nickname;
			$('#whoru').text(`${nickname}님, 안녕하세요!`);
			$('#before_login_btn').addClass('d-none');
			$('#after_login_btn').removeClass('d-none');
		},
		error: () => {
			$('#before_login_btn').removeClass('d-none');
			$('#after_login_btn').addClass('d-none');
		}
	});
});
function show_list() {
	$.ajax({
		type: 'get',
		url: `/list`,
		success: function (response) {
			let temp_html = '';
			for (info of response) {
				temp_html += `
				<div class="card mt-3">
					<div class="card-body">
						<h5 class="card-title">${info['title']}</h5>
						<p class="card-text">${info['nickname']} | ${info['date']}</p>
						<a href="/${info['postId']}" class="btn btn-primary">자세히 보기</a>
					</div>
				</div>
				`;
			}
			$('#contents').append(temp_html);
		}
	});
}
