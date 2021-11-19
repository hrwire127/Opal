const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function ()
{
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } };

const EstateSchema = new Schema({
    title: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: {
        type: String
    },
    images: {
        type: [ImageSchema]
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    
}, opts);



EstateSchema.virtual('properties.popUpMarkup').get(function ()
{
    return `<strong><a href="/estates/${this._id}">${this.title}</a></strong>`;
})


EstateSchema.post('findOneAndDelete', async function (estate)
{
    if (estate)
    {
        await Review.deleteMany({
            _id: {
                $in: estate.reviews
            }
        })
    }
})

module.exports = mongoose.model('Estate', EstateSchema)