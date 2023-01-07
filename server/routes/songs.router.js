const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const axios = require('axios');
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');
const { response } = require('express');


/**
 * Retrieve a track from the Spotify API
 */
//TODO: Do I have the params set up correct? Will this accomplish anything?
router.get('/:trackid', rejectUnauthenticated, (req, res) => {
  // GET route code here
  axios.get(`https://api.spotify.com/v1/tracks/${req.params.id}/&apikey=${process.env.SPOTIFY_API_KEY}`)
  .then(response => {
    //promise.all???
    res.send(response.data)
  })
  .catch(error => {
    // is there a better way to throw an error in this case?
    console.log(error);
  })
});

/**
 * Retrieve user song recommendations from the Spotify API
 */
//TODO: Do I have the params set up correct? Will this accomplish anything?
router.get('/recommendations/:recommendations', rejectUnauthenticated, (req, res) => {
    // GET route code here
    axios.get(`https://api.spotify.com/v1/recommendations.json?query=${req.params.recommendations}&apikey=${process.env.SPOTIFY_API_KEY}`)
    .then(response => {
      //promise.all???
      res.send(response.data)
    })
    .catch(error => {
      // is there a better way to throw an error in this case?
      console.log(error);
    })
  });

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;
