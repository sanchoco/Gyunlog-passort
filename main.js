// 익스프레스
const express = require('express');
const app = express();
const port = 3000;

// 환경 변수
require('dotenv').config();

// MongoDB
const mongoose = require('./schemas/db');

// session
const session = require('express-session');
const MongoStore = require('connect-mongo');
app.use(
	session({
		secret: process.env.SECRET_KEY,
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URL,
			ttl: 1 * 24 * 60 * 60
		}),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 1
		}
	})
);

const passport = require('./lib/passport');
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
