const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync')

const userController = require('../controllers/userController')

router.route('/register')
    .get(userController.renderRegister)
    .post(catchAsync(userController.postRegister));

router.route('/login')
    .get(userController.renderLogin)
    .post(passport.authenticate('local',
        { failureFlash: true, failureRedirect: '/auth/login' }),
        userController.postLogin
    );

router.get('/logout', userController.logout)

module.exports = router;