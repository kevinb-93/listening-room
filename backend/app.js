const express = require("express");
const generateRandomString = require("./utils/string");
const queryString = require("querystring");
const spotify = require("./utils/spotify");

const app = express();

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(spotify.stateKey, state);

    const params = queryString.stringify({
        response_type: 'code',
        client_id: spotify.client_id,
        scope: spotify.scope,
        redirect_uri: spotify.redirect_uri,
        state: state
    });

    // request spotify authorization
    res.redirect(`https://accounts.spotify.com/authorize?${params}`)
}) 

const port = 5000;
console.log(`Listening on ${port}`);
app.listen(port);