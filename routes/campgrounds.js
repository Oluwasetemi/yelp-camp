const express = require('express')
const router = express.Router()

const Campground = require('../models/campground')
const middleware = require('../middleware')

const multer = require('multer');
let storage = multer.diskStorage({
	filename: function (req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
let imageFilter = function (req, file, cb) {
	// accept image files only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};
let upload = multer({
	storage: storage,
	fileFilter: imageFilter
})

let cloudinary = require('cloudinary')

cloudinary.config({
	cloud_name: 'drnqdd87d',
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

let NodeGeocoder = require('node-geocoder')

let options = {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null
}

let geocoder = NodeGeocoder(options)


router.get('/', (req, res) => {
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi')
		Campground.find({
			name: regex
		}, (err, allCampgrounds) => {
			if (err) {
				req.flash('error', 'Database Error')
			} else {

				if (allCampgrounds.length < 1) {
					req.flash('error', 'No campground match the search query')
					res.redirect('/campgrounds')
				} else {
					res.render('campgrounds/index', {
						campgrounds: allCampgrounds,
						currentUser: req.user,
					})
				}

			}
		})

	} else {
		Campground.find({}, (err, allCampgrounds) => {
			if (err) {
				req.flash('error', 'Cannot find campground')
			} else {
				res.render('campgrounds/index', {
					campgrounds: allCampgrounds,
					currentUser: req.user
				})
			}
		})
	}

})

router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campgrounds/new')
})

router.post('/', middleware.isLoggedIn, upload.single('image'), (req, res) => {
	let campground = req.body.campground
	let { id, username } = req.user
	let author = { id, username }
	campground.author = author

	geocoder.geocode(campground.location, function (err, data) {
		if (err || !data.length) {
			req.flash('error', 'Invalid address')
			return res.redirect('back')
		}

		campground.lat = data[0].latitude
		campground.lng = data[0].longitude
		campground.location = data[0].formattedAddress

		cloudinary.v2.uploader.upload(req.file.path, (err,result) => {
			console.log(campground)
			campground.image = result.secure_url
			campground.imageId = result.public_id

			Campground.create(campground, (err, newlyCreated) => {
				if (err) {
					req.flash('error', 'Cannot create campground')
					return res.redirect('back')
				}
				req.flash('success', `Successfully created a new campground named ${newlyCreated.name}`)
				res.redirect(`/campgrounds/${newlyCreated.id}`)
			})
		})


	})
})

router.get('/:id', (req, res) => {
	// const campgrounds = Campground.find()
	// const count = campgrounds.count()
	// console.log(count)
	Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
		if (err) {
			req.flash('error', 'Campground not found')
		} else {
			// console.log(foundCampground);
			res.render('campgrounds/show', {
				campground
				// campgrounds,count
			})
		}
	})
})

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnerShip,
	(req, res) => {
		Campground.findById(req.params.id, (err, foundCampground) => {
			res.render('campgrounds/edit', {
				campground: foundCampground
			})
		})
	})

// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnerShip, upload.single('image'),
	(req, res) => {
		let campground = req.body.campground
	geocoder.geocode(campground.location, function (err, data) {
		if (err || !data.length) {
			req.flash('error', `Invalid address ${err.message}`)
			return res.redirect('back')
		}

		Campground.findById(req.params.id, (err, campground) => {
			if (err) {
				req.flash('error', err.message)
				return res.redirect('/campgrounds')
			}

			if (req.file) {
				cloudinary.v2.uploader.destroy(campground.image_id, (err) => {
					if (err) {
						req.flash('error', `Invalid address ${err.message}`)
						res.redirect('back')
					}
					cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
						if (err) {
							req.flash('error', `Invalid address ${err.message}`)
							return res.redirect('back')
						}
						campground.lat = data[0].latitude
			campground.lng = data[0].longitude
			campground.location = data[0].formattedAddress
						campground.imageId = result.public_id
						campground.image = result.secure_url
					})
				})
			}
			campground.name = campground.name
			campground.description = campground.description
			console.log(campground);
			campground.save(() => console.log('updated camp saved'))
			req.flash('success', `Successfully Updated a ${campground.name} Campground`)
			res.redirect(`/campgrounds/${req.params.id}`)
		})
	})
})

// TODO: DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnerShip, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect('/campgrounds')
		} else {
			res.redirect('/campgrounds')
		}
	})
})


function escapeRegex(text) {
	return text.replace(/[*[\]{}()^*?.,\\^$!#\s]/g, '\\$&')
}

module.exports = router