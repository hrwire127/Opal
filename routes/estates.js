const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const multer = require('multer');
const { isLoggedIn, validateEstate, verifyAuthor } = require('../middleware');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const estateController = require('../controllers/estateController');

router.route('/')
    .get(catchAsync(estateController.index))
    .post(isLoggedIn, upload.array('image'), catchAsync(estateController.postNew));

router.get('/new', isLoggedIn, estateController.renderNew);

router.route('/:id')
    .get(catchAsync(estateController.renderEstate))
    .put(isLoggedIn, verifyAuthor, upload.array('image'), validateEstate, catchAsync(estateController.postEstate))
    .delete(isLoggedIn, verifyAuthor, catchAsync(estateController.deleteEstate));

router.get('/:id/edit', isLoggedIn, verifyAuthor, catchAsync(estateController.editEstate));



module.exports = router;