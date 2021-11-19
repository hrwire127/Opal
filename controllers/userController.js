const User = require('../models/user')
const passport = require('passport');

module.exports.renderRegister =  (req, res) =>
{
    res.render('users/register')
}

module.exports.postRegister = async (req, res, next) =>
{
    try
    {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const reguser = await User.register(user, password);
        req.login(reguser, err =>
        {
            if (err) return next(err);
            req.flash('success', 'Welcome to Opal');
            res.redirect('/estates');
        });
    }
    catch (e)
    {
        req.flash('error', e.message);
        res.redirect('/auth/register');
    }
}

module.exports.renderLogin =  (req, res) =>
{
    res.render('users/login');
}

module.exports.postLogin = (req, res) =>
{
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/estates';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res) =>
{
    req.logout();
    req.flash("success", "Goodbye")
    res.redirect('/');
}