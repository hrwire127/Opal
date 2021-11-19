const Review = require('../models/review');
const Estate = require('../models/estate');



module.exports.postReview = async (req, res) =>
{
    const estate = await Estate.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    estate.reviews.push(review);
    req.flash('success', 'Succesfully created a review!')
    await review.save();
    await estate.save();

    res.redirect(`/estates/${estate._id}`);
}

module.exports.deleteReview = async (req, res) =>
{
    const { id, reviewId } = req.params;
    req.flash('success', 'Succesfully deleted a review!')
    await Estate.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId);

    res.redirect(`/estates/${id}`);
}