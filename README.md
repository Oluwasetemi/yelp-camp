# What I need to do YelpCamp Project

* Add landing Page
* Add Campgrounds from Page that list all Campgrounds

Each Campground has :

* Name
* Image

```json
[{ "name": "", "image": "" }, { "name": "", "image": "" }]
```

## Layout and Basic Styling

* Create our header and footer partials
* Add in bootstrap or Personal Styles

## Creating New Campgrounds

* Setup new campground POST route
* Add in body-parser
* Setup route to show from
* Add basic unstyled form

## Style the campgrounds Page

* Add a better header/title
* Make campgrounds display in a grid

## Style the Navbar and form

* Add a navbar to all templates
* Style the new campground form

## Add Mongoose

* Install and configure Mongoose
* Setup campground model
* Use campground model inside of our routes

## Show Page

* Review the RESTful routes we've seen so far
* Add description to our campground model
* Show db.collection.drop()
* Add a show route/template

## Refactor Mongoose

* Create a models directory
* Use module.exports
* Require everything correctly!

## Add the Comment model!

* Make our error go away!
* Display comments on campground show page

## Comment New/ Create

* Discuss nested routes
* Add the comment new and create routes
* Add the new comment form

## Style Show page

* Add sidebar to show page
* Display comments nicely

## Finish Styling Show Page

Add public directory
Add custom stylesheet

## Auth Part 1 - Add Use model

* Install all packages needed for auth
* Define User model

## Auth Part 2 - Register

* Configure Passport
* Add register routes
* Add register template

## Auth Part 3 - Login

* Add login routes
* Add login template

## Auth Part 4 - Logout/ Navbar

* Add logout route
* Prevent user from adding a comment if not signed in
* Add links to navbar
* Show/hide auth links correctly

## Auth Part 5 - Show/ Hide links

* Show/ hide auth link in navbar correctly

## Refactor The Routes

* Use Express router to recognize all routes

## Users + Comments

* Associate users and comments
* Save author's name to a comment automatically

## Users + Campgrounds

* Prevent an unauthenticated user from creating a campground
* Save username+id to newly created campground

## Editing Campgrounds

* Add Method-Override
* Add Edit Route for Campgrounds
* Add Link to Edit Page
* Add Update Route
* Fix $set problem