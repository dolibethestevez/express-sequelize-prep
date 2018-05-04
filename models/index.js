var Sequelize = require("sequelize");
var db = new Sequelize("postgres://localhost:5432/express_sequelize_review", {
  logging: false
});

var Tweet = db.define(
  "tweet",
  {
    text: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [0, 140],
          msg: "Validation len failed"
        }
      }
    },
    hashtags: {
      type: Sequelize.VIRTUAL,
      get() {
        return this.getDataValue("text")
          .split("#")
          .slice(1)
          .map(el => `#${el.trim()}`);
      }
    }
  },
  {
    instanceMethods: {
      addTag: function(tag) {
        this.text += `#${tag}`;
        return this;
      }
    },
    classMethods: {
      findByHashtag: function() {
        Tweet.findAll({
          where: {
            hashtags: {
              gte: 0
            }
          }
        });
      }
    }
  }
);

var User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Tweet.belongsTo(User);

module.exports = db;
