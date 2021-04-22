// 익스프레스
const express = require('express');
const app = express();
const port = 3000;

// MongoDB
const connect = require('./schemas/db');
connect();

// session
const session = require('express-session');
// const FileStore = require('session-file-store')(session);
const LokiStore = require('connect-loki')(session);
app.use(
	session({
		secret: require('./secret_key'),
		resave: false,
		saveUninitialized: true,
		store: new LokiStore()
	})
);

const { passport } = require('./lib/passport');
app.use(passport.initialize());
app.use(passport.session());

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// 홈
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

// 라우터
const router = require('./routers/router');
app.use('/', [router]);

//listen
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
