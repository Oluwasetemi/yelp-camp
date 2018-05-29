# What I need to do YelpCamp Project

<!-- TOC -->

- [What I need to do YelpCamp Project](#what-i-need-to-do-yelpcamp-project)
  - [Layout and Basic Styling](#layout-and-basic-styling)
  - [Creating New Campgrounds](#creating-new-campgrounds)
  - [Style the campgrounds Page](#style-the-campgrounds-page)
  - [Style the Navbar and form](#style-the-navbar-and-form)
  - [Add Mongoose](#add-mongoose)
  - [Show Page](#show-page)
  - [Refactor Mongoose](#refactor-mongoose)
  - [Add the Comment model](#add-the-comment-model)
  - [Comment New/ Create](#comment-new--create)
  - [Style Show page](#style-show-page)
  - [Finish Styling Show Page](#finish-styling-show-page)
  - [Auth Part 1 - Add Use model](#auth-part-1---add-use-model)
  - [Auth Part 2 - Register](#auth-part-2---register)
  - [Auth Part 3 - Login](#auth-part-3---login)
  - [Auth Part 4 - Logout/ Navbar](#auth-part-4---logout--navbar)
  - [Auth Part 5 - Show/ Hide links](#auth-part-5---show--hide-links)
  - [Refactor The Routes](#refactor-the-routes)
  - [Users + Comments](#users-comments)
  - [Users + Campgrounds](#users-campgrounds)
  - [Editing Campgrounds](#editing-campgrounds)
  - [Deleting Campgrounds](#deleting-campgrounds)
  - [Authorization](#authorization)
  - [Editing Comments](#editing-comments)
  - [Deleting Comments](#deleting-comments)
  - [Authorization for Comments](#authorization-for-comments)
  - [Create an Admin](#create-an-admin)
  - [Added Moment.js](#added-momentjs)
  - [Create User Profiles](#create-user-profiles)
  - [Add Google Maps](#add-google-maps)

<!-- /TOC -->

* Add landing Page
* Add Campgrounds from Page that list all Campgrounds

Each Campground has :

* Name
* Image
* description

```json
[
  {
    "name": "",
    "image": "",
    "description": ""
  },
  {
    "name": "",
    "image": "",
    "description": ""
  }
]
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

## Add the Comment model

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
* Fix `$set` problem

## Deleting Campgrounds

* Add Destroy route
* Add Delete button

## Authorization

* User can only edit his/her campgrounds
* User can only delete his/her campgrounds
* Hide/Show edit and delete buttons

## Editing Comments

* Add Edit route for comments
* Add Edit button
* Add Update route

## Deleting Comments

* Add Destroy route
* Add Delete button

## Authorization for Comments

* User can only edit his/her comments
* User can only delete his/her comments
* Hide/Show edit and delete buttons
* Refactor Middleware

<!-- TODO! -->

## Create an Admin

* Embed the `isAdmin` on the user model.
* Give the admin the power to `edit` and `delete` any camp or comment.
* Add to controller.

## Added Moment.js

* add created to the Campground and comment models
* add moment to locals to make it available in each page
* add moment to the show page with the `fromNow` method

## Create User Profiles

* add the new details to the User model
* Get the new details from the register routes and save to the database
* create a user/:id routes where you display each new user id.

## Add Google Maps

* Get Map Key and add to t
  he `env` variable
* Add Google Maps scripts to your application
* Display the campground location in show.ejs
* Update campground model
* Update new and edit forms and add location input field
* Update campground routes
