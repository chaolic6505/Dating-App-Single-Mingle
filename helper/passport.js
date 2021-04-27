const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

const keys = require('../config/keys');

const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function (passport) {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
			},
			(email, password, done) => {
				// Match user
				User.findOne({
					email: email,
				})
					.then((user) => {
						if (!user) {
							return done(null, false, {
								message: 'That email is not registered. ⛔️',
							});
						}
						// Match password
						bcrypt.compare(password, user.password, (err, isMatch) => {
							if (err) throw err;
							if (isMatch) {
								return done(null, user);
							} else {
								return done(null, false, {
									message: 'Password is incorrect. ⛔️',
								});
							}
						});
					})
					.catch((err) => console.log(err));
			},
		),
	);

	passport.use(
		new FacebookStrategy(
			{
				clientID: keys.FACEBOOK_APP_ID,
				clientSecret: keys.FACEBOOK_APP_SECRET,
				callbackURL: '/auth/facebook/callback',
				profileFields: ['emails', 'name', 'displayName', 'gender', 'profileUrl'],
			},
			(accessToken, refreshToken, profile, done) => {
				email = profile._json.email;
				name = profile._json.name;
				gender =
					profile._json.gender.charAt(0).toUpperCase() + profile._json.gender.slice(1);

				password = profile._json.id;
				password2 = profile._json.id;

				User.findOne({ email: email }).then((user) => {
					if (user) {
						return done(null, user);
					} else {
						return done(null, false, {
							message: 'We need  more information from you .',
						});
					}
				});
			},
		),
	);
	passport.use(
		new GoogleStrategy(
			{
				clientID: keys.Google_ID,
				clientSecret: keys.Google_Secret,
				callbackURL: '/auth/google/callback',
			},
			(accessToken, refreshToken, profile, done) => {
				email = profile._json.email;
				name = profile._json.name;
				password = profile._json.sub;
				password2 = profile._json.sub;
				User.findOne({ email: email }).then((user) => {
					if (user) {
						return done(null, user);
					} else {
						return done(null, false, {
							message: 'We need  more information from you .',
						});
					}
				});
			},
		),
	);

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
};
