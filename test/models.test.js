var chai = require("chai");
var expect = chai.expect;
var db = require("../models");
var Tweet = db.model("tweet");
var User = db.model("user");
var Promise = require("bluebird");
chai.use(require("chai-things"));

var testUser, expressTweet;

before(function() {
  return db
    .sync({ force: true })
    .then(function() {
      return User.create({
        name: "Checkpoint Acer"
      });
    })
    .then(function(user) {
      testUser = user;
    })
    .then(function() {
      return Tweet.create({
        text: "Sequelize is the best! #fsa #sql"
      });
    })
    .then(function() {
      return Tweet.create({
        text: "Express is the best! #fsa #middleware"
      });
    })
    .then(function(tweet) {
      expressTweet = tweet;
    });
});

var mainTweetText =
  "Hello world! This is my first tweet and I am pumped! #awesome #stellar #omg";

describe("Tweet Model", function() {
  describe("Attributes", function() {
    it("has a text field of type String", function() {
      return Tweet.create({
        text: mainTweetText
      }).then(function(savedTweet) {
        expect(savedTweet.text).to.equal(mainTweetText);
      });
    });

    it("requires text", function() {
      var tweet = Tweet.build({});
      return tweet.validate().then(function(result) {
        expect(result).to.be.an("object");
        expect(result.message).to.contain("text cannot be null");
      });
    });

    it("ensures tweets are no longer than 140 characters", function() {
      var longText =
        "This is a really long tweet to showcase that tweets should not be more than 140 characters long. I've run out of things to say so goodbye now!";
      var longTweet = Tweet.build({
        text: longText
      });
      var normalTweet = Tweet.build({
        text: "This is a short tweet"
      });
      return Promise.all([longTweet.validate(), normalTweet.validate()]).spread(
        function(longErr, normalErr) {
          expect(longErr).to.be.an("object");
          expect(longErr.errors).to.include.a.thing.with.property(
            "message",
            "Validation len failed"
          );
          expect(normalErr).to.be.null;
        }
      );
    });
  });

  describe("Additional Model Properties", function() {
    it("has a virtual array of hashtags included in the tweet", function() {
      return Tweet.findOne({ where: { text: mainTweetText } }).then(function(
        tweet
      ) {
        expect(tweet.text).to.equal(mainTweetText);
        expect(tweet.hashtags).to.have.lengthOf(3);
        expect(tweet.hashtags).to.include("#awesome");
      });
    });

    it("has an instance method to add a hashtag to the tweet", function() {
      return Tweet.findOne({
        where: { text: "Sequelize is the best! #fsa #sql" }
      })
        .then(function(tweet) {
          expect(tweet.hashtags).to.not.include("#winning");
          return tweet.addTag("winning");
        })
        .then(function(tweet) {
          expect(tweet.hashtags).to.include("#winning");
        });
    });

    it("has a class method which searches by hashtag", function() {
      return Tweet.findByHashtag("#fsa").then(function(tweets) {
        expect(tweets).to.have.lengthOf(2);
        expect(tweets).to.include.a.thing.with.property(
          "text",
          "Express is the best! #fsa #middleware"
        );
      });
    });
  });

  describe("Relations/Associations", function() {
    it("belongs to a user", function() {
      return expressTweet
        .setUser(testUser)
        .then(function() {
          return Tweet.findOne({
            where: { text: expressTweet.text },
            include: { model: User }
          });
        })
        .then(function(tweet) {
          expect(tweet.user).to.exist;
          expect(tweet.user.name).to.equal("Checkpoint Acer");
        });
    });
  });
});
