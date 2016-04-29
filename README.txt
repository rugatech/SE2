ALL NON-VENDOR SCRIPTS were written, tested, and debugged by Nick Taylor

Layout of this directory

api - Folder containing all files pertaining to the RESTFul API
api/app.php - Landing page for the API. This is where the API is constructed
api/composer.json - configuration file for composer. Composer is a PHP program was to manage dependencies
api/web.config - IIS file to allow Friend URLs to be used (required for all RESTful APIs
api/vendor - Third party open source software used to create the RESTful API
api/bsc - Folder containing all code written by Nick to run the API
api/bsc/bscException.php - Custom Exception handler for the API and Datastore
api/bsc/api/api.php - Primary file used by API for configuring routes and invoking the datastore
api/bsc/api/APIException.php - Custom Exception handler for exceptions thrown by the API (extends bscExpection).
api/bsc/datastore/datastore - Primary file used by the datastore. Contains all SQL queries site by the project
api/bsc/datastore/DatastoreException - Custom Exception handler for exceptions thrown by the Datastore (extends bscExpection).
api/bsc/datastore/PDODriver.php - Used by the datastore to establish a connection to the database using the PHP-PDO library
api/bsc/model - This folder contains all Matlab scripts for stock predictions

website - Folder containing all files pertaining to the website
website/css - CSS files
website/images - Image files
website/js - Javascript files written by Nick
website/lib - Javascript library files such as AngularJS, bootstrap, etc
website/partials - HTML files used by AngularJS to build the website
website/index.html - Start up page for the website

Requirements:
IIS 7.5
PHP 5.6.15
MySQL 5.6.21
Matlab R2015B