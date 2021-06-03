function check_id(id) {
	if (id.length < 3) return false;
	const allow_char = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
	for (c of id) {
		if (!allow_char.includes(c)) return false;
	}
	return true;
}

// 비밀번호가 4자 이상이고 아이디가 포함되선 안됨.
function check_password(id, password) {
	if (password.length < 4) return false;
	if (password.includes(id)) return false;
	if (id.includes(password)) return false;
	return true;
}

// 닉네임이 2자 이상이고 10자 미만, 공백이 없는 경우만 경우만 통과
function check_nickname(nickname) {
	if (nickname.length < 2) return false;
	if (nickname.length > 10) return false;
	if (nickname.includes(' ')) return false;
	return true;
}

module.exports = { check_id, check_password, check_nickname };
