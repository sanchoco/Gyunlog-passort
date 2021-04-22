$(document).ready(function () {
	checkLogin();
});

function new_post() {
	window.location.href = '/new';
}

function goHome() {
	window.location.href = '/';
}

function goLogin() {
	window.location.href = '/login';
}

function goRegister() {
	window.location.href = '/register';
}

function logout() {
	window.location.href = '/logout';
}

function checkLogin() {
	$.ajax({
		type: 'get',
		url: `/user`,
		success: function (response) {
			$('#before_login').addClass('d-none');
			$('#after_login').removeClass('d-none');
		},
		error: function (xhr, textStatus, error) {
			$('#before_login').removeClass('d-none');
			$('#after_login').addClass('d-none');
		}
	});
}
