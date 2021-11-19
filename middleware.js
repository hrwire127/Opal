const { estateSchema, reviewSchema } = require('./schemas.js');
const Estate = require('./models/estate');
const Review = require('./models/review');
const ExpressError = require('./utilities/Error');

const isLoggedIn = (req, res, next) =>
{
    if (!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/auth/login');
    }
    next();
};

const validateEstate = (req, res, next) =>
{
    console.log(req.body);
    const { error } = estateSchema.validate(req.body) //{} aces something in this (req.body)
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else
    {
        next();
    }
}

const verifyAuthor = async (req, res, next) =>
{
    const { id } = req.params;
    const estate = await Estate.findById(id);
    if (!estate.author.equals(req.user._id)) 
    {
        req.flash('error', 'No Permission!')
        return res.redirect(`/estates/${id}`) //?return
    }
    next();
}

const validateReview = (req, res, next) =>
{
    
    const { error } = reviewSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else
    {
        next();
    }
}

const verifyReview = async (req, res, next) =>
{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) 
    {
        req.flash('error', 'No Permission!')
        return res.redirect(`/estates/${id}`) //?return
    }
    next();
}


module.exports.isLoggedIn = isLoggedIn;

module.exports.validateEstate = validateEstate;

module.exports.verifyAuthor = verifyAuthor;

module.exports.validateReview = validateReview;

module.exports.verifyReview = verifyReview;