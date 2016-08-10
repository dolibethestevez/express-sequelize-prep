var router = require('express').Router();
var db = require('../models/');
var Tweet = db.model('tweet');

router.get('/tweets', function (req, res, next) {
  if (req.query.hashtag) {
    console.log(req.query.hashtag);
    Tweet.findByHashtag('#' + req.query.hashtag)
    .then(function (tweets) {
      res.send(tweets);
    })
    .catch(next);
  } else {
    Tweet.findAll()
    .then(function (tweets) {
      res.send(tweets);
    })
    .catch(next);
  }
});

router.get('/tweets/:id', function (req, res, next) {
  Tweet.findById(req.params.id)
  .then(function (tweet) {
    res.send(tweet);
  })
  .catch(next);
});

router.post('/tweets', function (req, res, next) {
  Tweet.create(req.body)
  .then(function (tweet) {
    res.status(201).send(tweet);
  })
  .catch(next);
});

router.put('/tweets/:id', function (req, res, next) {
  Tweet.findById(req.params.id)
  .then(function (tweet) {
    tweet.addTag(req.body.hashtag);
    return tweet.save();
  })
  .then(function (tweet) {
    res.send(tweet);
  })
  .catch(next); 
});

router.use(function (err, req, res, next) {
  console.log(err);
  res.sendStatus(404);
})

module.exports = router;
