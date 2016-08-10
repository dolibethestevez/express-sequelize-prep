var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/express_sequelize_review', { logging: false });



module.exports = {
    Tweet: Tweet,
    User: User
}
