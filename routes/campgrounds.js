const express = require('express')
const router = express.Router()

const Campground = require('../models/campground')
const middleware = require('../middleware')

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

router.post('/', middleware.isLoggedIn, (req, res) => {
	const { name, price, image, description } = req.body
	const { id, username } = req.user
	const author = { id, username }

	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
			req.flash('error', 'Invalid address')
			return res.redirect('back')
		}
		let lat = data[0].latitude
		let lng = data[0].longitude
		let location = data[0].formattedAddress

		const newCampground = {
			name: name,
			image: image,
			price,
			description: description,
			author,
			location,
			lat,
			lng
		}
		Campground.create(newCampground, (err, newlyCreated) => {
			if (err) {
				req.flash('error', 'Cannot create campground')
			} else {
				req.flash('success', `Successfully created a new campground named ${newlyCreated.name}`)
				res.redirect('/campgrounds')
			}
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
				campground: campground,
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
router.put('/:id', middleware.checkCampgroundOwnerShip, (req, res) => {
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
			req.flash('error', 'Invalid address')
			return res.redirect('back')
		}
		req.body.campground.lat = data[0].latitude
		req.body.campground.lng = data[0].longitude
		req.body.campground.location = data[0].formattedAddress

		Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
			if (err) {
				req.flash('error', err.message)
				res.redirect('/campgrounds')
			} else {
				req.flash('success', `Successfully Updated a ${updatedCampground.name} Campground`)
				res.redirect(`/campgrounds/${req.params.id}`)
			}
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