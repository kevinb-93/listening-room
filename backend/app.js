const express = require("express");
const generateRandomString = require("./utils/string");
const queryString = require("querystring");
const spotify = require("./utils/spotify");
const secret = require("./utils/secret");
const server = require("./utils/server");
const axios = require("axios");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.static(__dirname + '/public')).use(cookieParser());

app.get('/login', (req, res) => {
    /**
     * An opaque value used by the client to maintain
         state between the request and callback.  The authorization
         server includes this value when redirecting the user-agent back
         to the client.  The parameter SHOULD be used for preventing
         cross-site request forgery
    */
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
});

app.get('/callback', (req, res) => {
    //request refresh and access tokens after checking state param

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[spotify.stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      queryString.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(spotify.stateKey);

    axios.post('https://accounts.spotify.com/api/token', queryString.stringify({
        code: code,
        redirect_uri: spotify.redirect_uri,
        grant_type: 'authorization_code'
      }), { 
          headers: {
              'Authorization': 'Basic ' + (Buffer.from(spotify.client_id + ':' + secret.spotify_client_secret).toString('base64'))
            }
        }).then((response) => {
            if (response.status === 200) {
             const access_token = response.data.access_token,
                refresh_token = response.data.refresh_token;

                res.redirect(`/spotify-auth.html#${queryString.stringify({ access_token: access_token,refresh_token: refresh_token })}`);

                // axios.get("https://api.spotify.com/v1/me", {
                //     headers: { 'Authorization': 'Bearer ' + access_token }
                // }).then((response) => {
                //     console.log(response.data);
                // });
            }
        }).catch((error) => {
            res.redirect(`/spotify-auth.html#${queryString.stringify({ error: 'invalid_token'})}`);
        });
    }
});


app.listen(server.port, () => {
    console.log(`Listening on ${server.port}`) 
});