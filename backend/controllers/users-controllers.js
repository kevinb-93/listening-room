const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const signup = async (req, res, next) => {
    // validate request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
    }

    const { name, email, password } = req.body;

    let existingUser;

    // check for an existing user
    try {
        existingUser = await User.findOne({ email });
    } catch (e) {
        return next(new HttpError(
      'Signing up failed, please try again later.',
      500
    ))
    }

    if (existingUser) {
    return next(new HttpError(
      'User exists already, please login instead.',
      422
    ));
    }

    const newUser = new User({ name, email, password});


    // save new user
    try {
        await newUser.save();
    } catch (e) {
    return next(new HttpError(
      'Signing up failed, please try again later.',
      500
    ));
    }

    res.status(201).json({ userId: newUser.id, email: newUser.email });

};

exports.signup = signup;