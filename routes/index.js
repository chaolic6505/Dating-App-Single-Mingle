const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

const { ensureAuthenticated, forwardAuthenticated } = require('../helper/auth');

// Welcome Page
router.get('/', (req, res) => {
	res.render('welcome');
});

// Dashboard
let i = 0;
router.get('/dashboard', ensureAuthenticated, (req, res) => {
	console.log('/dashboard');
	let main = {};

	let temp_arr = [];

	User.findOne({ email: req.user.email }, async (err, obj) => 
	{
		await obj;
		
		User.find(
			{
				$and: [
					{
						email: { $ne: obj.email },
					},
					{
						hobby: obj.hobby_pref,
					},
					{
						gender: obj.gender_pref,
					},
					{
						age: {
							$gte: obj.min_age,
							$lte: obj.max_age,
						},
					},
				],
			},
			(err, doc) => {
				doc.forEach((element) => {
					console.log(element.name);
					temp_arr.push(element);
				});

				let len = temp_arr.length;

				if (i < len) {
					res.render('dashboard', {
						user: req.user,
						new_user: temp_arr[i],
					});
					i++;
				} else {
					i = 0;

					res.render('dashboard', {
						user: req.user,
						new_user: temp_arr[i],
					});
					i++;
				}
			},
		);
	});
});

router.get('/setting', ensureAuthenticated, (req, res) => {
	//console.log('/setting');
	res.render('setting', {
		user: req.user,
	});
});

router.get('/faq', ensureAuthenticated, (req, res) => {
	//console.log('/faq');
	res.render('faq', {
		user: req.user,
	});
});

router.get('/pp', (req, res) => {
	//console.log('/pp');
	res.render('pp', {
		user: req.user,
	});
});
router.get('/tu', (req, res) => {
	//console.log('/tu');
	res.render('tu', {
		user: req.user,
	});
});
/* facebook login */
router.get(
	'/auth/facebook',
	passport.authenticate('facebook'),
	passport.authorize('facebook', { scope: ['email'] }),
	forwardAuthenticated,
);

router.get(
	'/auth/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/register',
	}),
	forwardAuthenticated,
);

router.get(
	'/auth/google',
	passport.authenticate('google', { scope: ['profile', 'email', 'openid'] }),
);

router.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/register',
	}),
	forwardAuthenticated,
);

// router.get(
// 	'/auth/spotify',
// 	passport.authenticate('spotify', {
// 		scope: [
// 			'user-read-email',
// 			'user-read-private',
// 			'playlist-modify-public',
// 			'playlist-modify-private',
// 		],
// 		showDialog: true,
// 	}),
// );

// router.get(
// 	'/auth/spotify/callback',
// 	passport.authenticate('spotify', { failureRedirect: '/users/register' }),
// 	function (req, res) {
// 		res.redirect('/dashboard');
// 	},
// );

// router.get('/auth/LK', passport.authenticate('linkedin'));

// router.get(
// 	'/auth/LK/callback',
// 	passport.authenticate('linkedin', {
// 		successRedirect: '/dashboard',
// 		failureRedirect: '/users/register',
// 	}),
// );

module.exports = router;
