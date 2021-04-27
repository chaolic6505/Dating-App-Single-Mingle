// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../helper/auth');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

const keys = require('../config/keys');

const getAge = require('../helper/getAge');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update({
	secretAccessKey: keys.iam_secret,
	accessKeyId: keys.iam_access_id,
	region: 'us-west-2',
});
s3 = new aws.S3();

const uploadS3 = multer({
	storage: multerS3({
		s3: s3,
		bucket: keys.Name,
		ContentDisposition: 'inline',
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: function (req, file, cb) {
		

			cb(null, 'steven/' + file.originalname);
		},
	}),
});

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => {
	console.log(req.name);
	let errors = [];

	errors.push({
		msg: 'Please register an account.',
	});

	res.render('register', { errors });
});

router.post('/location', (req, res) => {

	res.redirect('/dashboard');
});

router.post('/editsetting', (req, res) => {
	let temp_arr = [];
	let i = 0;
	
	
	console.log(req.body);
	
	min_age = req.body.min_age;
	max_age = req.body.max_age;
	max_distance = req.body.max_distance;

	if (!req.body.gender_pref) {
		gender_pref = req.user.gender_pref;
	} else {
		gender_pref = req.body.gender_pref;
	}
	if (!req.body.hobby_pref) {
		hobby_pref = req.user.hobby_pref;
	} else {
		hobby_pref = req.body.hobby_pref;
	}

	const query = { email: req.user.email };
	
	// Set some fields in that document
	const update_setting = {
		min_age: min_age,
		max_age: max_age,
		max_distance: max_distance,
		gender_pref: gender_pref,
		hobby_pref: hobby_pref,
	};
	// Return the updated document instead of the original document
	const options = { returnNewDocument: true };

	User.findOneAndUpdate(query, update_setting, options)
		.then(async (updatedDocument) => {
			if (updatedDocument) {
				await updatedDocument;
				console.log(`Successfully updated document`);
				res.redirect('/dashboard');
			} else {
				console.log('No document matches the provided query.');
				res.redirect('/setting');
			}
		})
		.catch((err) => console.error(`Failed to find and update document: ${err}`));
});

router.post('/register', uploadS3.array('image'), (req, res) => {
	console.log('Im at POST Register');

	const {
		name,
		email,
		password,
		password2,
		DOB,
		gender,
		hobby,
		school,
		job,
		info,
	} = req.body;
	age = GetAge(req.body.DOB);

	//console.log(name, email, password, password2, DOB, gender, school, job, info);

	let errors = [];

	//console.log(age);
	if (req.files.length !== 0) {
		URL = path.join(keys.CLOUDFRONT_URL, req.files[0].originalname);
		img = {
			data: URL,
			contentType: req.files[0].mimetype,
		};
	} else {
		errors.push({
			msg: 'Please submit an image.',
		});
	}

	if (
		!name ||
		!email ||
		!password ||
		!password2 ||
		!DOB ||
		!gender ||
		!hobby ||
		!school ||
		!job ||
		!info ||
		!req.files
	) {
		errors.push({
			msg: 'Please enter all fields.',
		});
	}

	// Check if passwords match
	if (password != password2) {
		errors.push({
			msg: 'Passwords do not match.',
		});
	}

	// Check minimum password length
	if (password.length < 6) {
		errors.push({
			msg: 'Password must be at least 6 characters.',
		});
	}
	if (age < 18) {
		errors.push({
			msg: 'You must be at least 18 years old !!! ',
		});
	}

	// Validation
	if (errors.length > 0) {
		res.render('register', {
			errors,
			name,
			email,
			password,
			password2,
			DOB,
			gender,
			hobby,
			school,
			job,
			info,
		});
	} else {
		User.findOne({
			email: email,
		}).then((user) => {
			if (user) {
				errors.push({
					msg: 'Email is already registered.',
				});
				res.render('register', {
					errors,
					name,
					email,
					password,
					password2,
					DOB,
					hobby,
					gender,
					school,
					job,
					info,
				});
			} else {
				const newUser = new User({
					name,
					email,
					password,
					DOB,
					age,
					gender,
					hobby,
					school,
					job,
					info,
					img,
				});

				// Hash password
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser
							.save()
							.then((user) => {
								req.flash('success_msg', 'You are now registered.');
								return res.redirect('/users/login');
							})
							.catch((err) => console.log(err));
					});
				});
			}
		});
	}
});

router.post(
	'/modify',
	uploadS3.fields([
		{
			name: 'image1',
			maxCount: 1,
		},
		{
			name: 'image2',
			maxCount: 1,
		},
		{
			name: 'image3',
			maxCount: 1,
		},
		{
			name: 'image4',
			maxCount: 1,
		},
		{
			name: 'image5',
			maxCount: 1,
		},
	]),
	async (req, res) => {
		await req.files;

		const { hobby, school, job, info } = req.body;

		if (req.files.length !== 0) {
			if (req.files.image1) {
				URL = path.join(keys.CLOUDFRONT_URL, req.files.image1[0].originalname);
				img = {
					data: URL,
					contentType: req.files.image1[0].mimetype,
				};
			} else {
				img = {
					data: req.user.img.data,
					contentType: req.user.img.contentType,
				};
			}

			if (req.files.image2) {
				URL2 = path.join(keys.CLOUDFRONT_URL, req.files.image2[0].originalname);
				//console.log(req.files.image2.mimetype)
				img2 = {
					data: URL2,
					contentType: req.files.image2[0].mimetype,
				};
			} else {
				img2 = {
					data: req.user.img2.data,
					contentType: req.user.img2.contentType,
				};
			}
			if (req.files.image3) {
				URL3 = path.join(keys.CLOUDFRONT_URL, req.files.image3[0].originalname);
				//console.log(req.files.image3.mimetype)
				img3 = {
					data: URL3,
					contentType: req.files.image3[0].mimetype,
				};
			} else {
				img3 = {
					data: req.user.img3.data,
					contentType: req.user.img3.contentType,
				};
			}
			if (req.files.image4) {
				URL4 = path.join(keys.CLOUDFRONT_URL, req.files.image4[0].originalname);
				//console.log(req.files.image4.mimetype)
				img4 = {
					data: URL4,
					contentType: req.files.image4[0].mimetype,
				};
			} else {
				img4 = {
					data: req.user.img4.data,
					contentType: req.user.img4.contentType,
				};
			}
			if (req.files.image5) {
				URL5 = path.join(keys.CLOUDFRONT_URL, req.files.image5[0].originalname);
				//console.log(req.files.image5.mimetype)
				img5 = {
					data: URL5,
					contentType: req.files.image5[0].mimetype,
				};
			} else {
				img5 = {
					data: req.user.img5.data,
					contentType: req.user.img5.contentType,
				};
			}
		} else {
			img = {
				data: req.user.img.data,
				contentType: req.user.img.contentType,
			};
			img2 = {
				data: req.user.img2.data,
				contentType: req.user.img2.contentType,
			};
			img3 = {
				data: req.user.img3.data,
				contentType: req.user.img3.contentType,
			};
			img4 = {
				data: req.user.img4.data,
				contentType: req.user.img4.contentType,
			};
			img5 = {
				data: req.user.img5.data,
				contentType: req.user.img5.contentType,
			};
		}

		const query = { email: req.user.email };
		// Set some fields in that document
		const update = {
			hobby: hobby,
			school: school,
			job: job,
			info: info,
			img: img,
			img2: img2,
			img3: img3,
			img4: img4,
			img5: img5,
		};
		// Return the updated document instead of the original document
		const options = { returnNewDocument: true };

		return User.findOneAndUpdate(query, update, options)
			.then((updatedDocument) => {
				if (updatedDocument) {
					//console.log(`Successfully updated document: ${updatedDocument}.`);
					res.redirect('/setting');
				} else {
					//console.log('No document matches the provided query.');
				}
				return updatedDocument;
			})
			.catch((err) => console.error(`Failed to find and update document: ${err}`));
	},
);


// Login
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: 'Missing credentials.',
	})(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are now logged out.');
	res.redirect('/users/login');
});

module.exports = router;
