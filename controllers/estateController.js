const Estate = require('../models/estate');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) =>
{
    const estates = await Estate.find({});
    res.render('estate/index', { estates })
}

module.exports.renderNew = (req, res) =>
{
    res.render('estate/new')
}

module.exports.postNew = async (req, res, next) =>
{
    const geodata = await geocoder.forwardGeocode({
        query: req.body.estate.location,
        limit: 1
    }).send()
    const estate = new Estate(req.body.estate);
    estate.geometry = geodata.body.features[0].geometry;
    estate.images = req.files.map(file =>
        ({ url: file.path, filename: file.filename }));
    estate.author = req.user._id;
    console.log(estate)
    await estate.save();
    req.flash('success', 'Succesfully created a estate!');
    res.redirect(`/estates/${estate._id}`);

}

module.exports.renderEstate = async (req, res) =>
{
    const id = req.params.id; //or {id} = req.params
    const estate = await Estate.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!estate) 
    {
        req.flash('error', 'Could not find estate');
        res.redirect('/estates');
    }
    res.render('estate/details', { estate });
}

module.exports.editEstate = async (req, res) =>
{
    const { id } = req.params;
    const estate = await Estate.findById(id)
    if (!estate) 
    {
        req.flash('error', 'Could not find estate');
        res.redirect('/estates');
    }

    res.render('estate/edit', { estate });
}

module.exports.postEstate = async (req, res) =>
{
    const { id } = req.params;
    const estate = await Estate.findByIdAndUpdate(id, req.body.estate);
    const images = req.files.map(file =>
        ({ url: file.path, filename: file.filename }));
    for (let i of images)
    {
        estate.images.push(i);
    }

    await estate.save()
    if (req.body.deleteImages)
    {
        for (let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename);
        }
        await estate.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Succesfully editied estate!')
    res.redirect(`/estates/${estate._id}`);
}


module.exports.deleteEstate = async (req, res) =>
{
    const { id } = req.params;
    await Estate.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted estate!')
    res.redirect('/estates')
}

