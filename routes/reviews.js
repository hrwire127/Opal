const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');


const { validateReview, isLoggedIn, verifyReview } = require('../middleware');

const reviewController = require('../controllers/reviewController');



router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.postReview))

router.delete('/:reviewId', isLoggedIn, verifyReview, catchAsync(reviewController.deleteReview))


module.exports = router;