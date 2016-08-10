var db = require('./database');
var Sequelize = require('sequelize');
var User = require('./user');

var Tweet = db.define('Tweet', {});

module.exports = Tweet;
