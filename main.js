const { ensureAuthenticated } = require('./helper/auth');
const expressLayouts = require('express-ejs-layouts');
const ignoreFavicon = require('./helper/ignoreFavicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const express = require('express');
const app = express();
const User = require('./models/User');

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/styles')));
app.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);
app.use(bodyParser.json());
app.use(ignoreFavicon);

// Passport Config
require('./helper/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log('Cloud DB Connected'))
	.catch((err) => console.log(err));

// Initialize EJS
app.use(expressLayouts);

app.set('view engine', 'ejs');

// Express body parser
app.use(
	express.urlencoded({
		extended: false,
	}),
);

// Express session
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	}),
);

// Connect flash
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables for flash
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

//Update user location
app.post('/location', ensureAuthenticated, (req, res) => {
	const query = { email: req.user.email };
	// Set some fields in that document
	const update_setting = {
		latitude: req.body.lat,
		longitude: req.body.long,
	};
	// Return the updated document instead of the original document
	const options = { returnNewDocument: true };

	User.findOneAndUpdate(query, update_setting, options)
		.then((updatedDocument) => {
			if (updatedDocument) {
				console.log(`Successfully updated document.`);
			} else {
				console.log('No document matches the provided query.');
			}
		})
		.catch((err) => console.error(`Failed to find and update document: ${err}`));
});

const rooms = {};
app.get('/message', ensureAuthenticated, (req, res) => {
	//console.log(Object.keys(rooms).length);

	let roomNumbers = Object.keys(rooms).length;

	res.render('message', {
		rooms: rooms,
		user: req.user,
		roomNumbers: roomNumbers,
	});
});

app.post('/room', ensureAuthenticated, (req, res) => {
	console.log('/room  ROUTE  !!!');
	console.log(req.body.room);
	senderEmail = req.user.email;
	receiverEmail = req.body.room;
	var data = { room: req.body.room };

	// User.updateOne({ email: receiverEmail }, { $addToSet: { rooms: data } }).exec();
	// User.find({ email: receiverEmail,
	//           rooms: { $in: [req.body.room] } })
	//   .update({$addToSet: { videoIDs: "34f54e34c" }})

	User.findOne(
		{
			name: req.body.room,
		},
		async (err, doc) => {
			//console.log(doc.img);
			await doc.img.data;
			if (rooms[req.body.room] != null) {
				return res.redirect('/message');
			}
			rooms[req.body.room] = {
				users: {},
				img: doc.img.data,
			};
			//console.log(rooms);
			res.redirect('message');
			io.emit('room-created', req.body.room);
		},
	);
});

const date = new Date();

app.get('/:room', ensureAuthenticated, (req, res) => {
	console.log(':room  ROUTE !!!');
	console.log(rooms);
	const options = {
		weekday: 'long',
		hour: '2-digit',
		minute: '2-digit',
	};
	if (rooms[req.params.room] == null) {
		return res.redirect('/message');
	}

	res.render('room', {
		roomName: req.params.room,
		time: date.toLocaleString('en-US', options),
		user: req.user,
		rooms: rooms,
	});
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT);

console.log(`Server running at http://localhost:${PORT}`);

const io = require('socket.io').listen(server);

const users = {};

io.on('connection', (socket) => {
	console.log('socket connect');
	//console.log(socket);
	socket.on('new-user', (room, name, email) => {
		//console.log(`${email} this is User email `);
		//console.log(`${room} this is ROOM `);
		//console.log(`${socket.id} this is socket.id `);
		//console.log(name)
		socket.join(room);

		rooms[room].users[socket.id] = name;
		//console.log(JSON.stringify(rooms) + 'this is ROOMS');
		socket.to(room).broadcast.emit('user-connected', name);
	});

	socket.on('send-chat-message', (room, message, email) => {
		console.log(email + 'this is email');
		console.log(room + 'this is room');
		console.log(message + 'this is message');
		console.log(
			rooms[room].users[socket.id] + 'this is rooms[room].users[socket.id]',
		);

		socket.to(room).broadcast.emit('chat-message', {
			message: message,
			name: rooms[room].users[socket.id],
		});
	});

	socket.on('disconnect', () => {
		getUserRooms(socket).forEach((room) => {
			socket
				.to(room)
				.broadcast.emit('user-disconnected', rooms[room].users[socket.id]);
			delete rooms[room].users[socket.id];
		});
	});
});

function getUserRooms(socket) {
	return Object.entries(rooms).reduce((names, [name, room]) => {
		if (room.users[socket.id] != null) names.push(name);
		return names;
	}, []);
}
