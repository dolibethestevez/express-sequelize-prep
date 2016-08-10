var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/express_sequelize_review', { logging: false });

var Tweet = db.define('tweet', {

});

var User = db.define('user', {

});

module.exports = db; 
