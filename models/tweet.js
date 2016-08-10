let db = require('./database');
let Sequelize = require('sequelize');
let User = require('./user');

let Tweet = db.define('Tweet', {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1,140]
    }
  },
  dateCreated: {
    type: Sequelize.DATE,
    defaultValue: Date.now
  }
}, {
  getterMethods: {
    hashtags: function () {
      var regex = /#\w+/gi;
      return this.text.match(regex);
    }
  },
  setterMethods: {
    timeWarp: function (dateString) {
      this.setDataValue('dateCreated', new Date(dateString));
    }
  },
  classMethods: {
    findByHashtag: function (hashtag) {
      return Tweet.findAll({
        where: {
          text: {
            $like: '%' + hashtag + '%' // translates to `SELECT * FROM Tweets WHERE text LIKE "%{hashtag}%"`
          }
        }
      })
    }
  }
});

Tweet.belongsTo(User); // adds UserId column to table and setUser instance method

module.exports = Tweet;
