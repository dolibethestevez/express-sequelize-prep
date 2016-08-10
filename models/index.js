var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/express_sequelize_review', { logging: false });

var Tweet = db.define('tweet', {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [0, 140]
    }
  }
}, {
  getterMethods: {
    hashtags: function () {
      var text = this.getDataValue('text');  
      var indexOfHash = text.indexOf('#');
      if (indexOfHash !== -1) {
        return text.slice(indexOfHash).split(' ');
      }
      return [];
    }
  },
  instanceMethods: {
    addTag: function (tagText) {
      this.setDataValue('text', this.getDataValue('text') + ' #' + tagText);
      return this;
    } 
  },
  classMethods: {
    findByHashtag: function (hashtag) {
      return Tweet.findAll()
      .then(function (tweets) {
        return tweets.filter(function (tweet) {
          return tweet.hashtags.indexOf(hashtag) !== -1;
        });
      });
    }
  }
});

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Tweet.belongsTo(User);

module.exports = db; 
