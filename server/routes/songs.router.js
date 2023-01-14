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
 * Delete user songs from the front end and database
 */
router.delete('/:id', rejectUnauthenticated, (req, res) => {
    // delete route code here
    const queryText = 'DELETE FROM "user_song_recs" WHERE "song_id"=$1';
    console.log('delete req.params.id', req.params.id);
    pool.query(queryText, [req.params.id])    
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
 * Insert song into database 
 */
router.post('/', (req, res) => {
  // POST route code here
  const insertEventQuery = `
    INSERT INTO "song_recs" ("spotify_uri", "spotify_id", "spotify_category_id", "spotify_user_id", "spotify_url")
    VALUES ($1, $2, $3, $4, $5) RETURNING id;`;

    pool.query(insertEventQuery, 
        [req.body.spotify_uri,
        req.body.spotify_id,
        req.body.spotify_category_id,
        req.body.spotify_user_id,
        req.body.spotify_url])
        pool.query(insertEventQuery, 
            [req.body.displayName,
            req.body.city,
            req.body.time,
            req.body.uri])
        .then((result) => {
            console.log('New song Id:', result.rows[0].id);
            
            const songId = result.rows[0].id; 
    
            // now handle user reference
            const userSongRecsJunctionQuery = `
            INSERT INTO "user_song_recs" ("user_id", "song_id")
            VALUES ($1, $2)`
            // look up asychronous express request (pizza parlour assignment)
            // more recommended approach
            // potential lecture topic!!!
            pool.query(userSongRecsJunctionQuery, [req.user.id, songId])
            .then(result => {
                res.sendStatus(201);
            }).catch(error => {
                console.log(error);
                res.sendStatus(500);
            })
    
        // catch for the first query    
        }).catch((error) => {
            console.log('Error in POST', error);
        })});

module.exports = router;
