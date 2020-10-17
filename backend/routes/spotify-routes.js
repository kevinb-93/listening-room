const express = require('express');

const spotifyControllers = require("../controllers/spotify-controllers");

const router = express.Router();

router.get('/login', spotifyControllers.login);

router.get('/callback', spotifyControllers.callback);

module.exports = router;