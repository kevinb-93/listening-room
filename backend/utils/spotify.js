const stateKey = 'spotify_auth_state';
const client_id = '7a0f28849e5247838ce0161501c98e4f';
const redirect_uri = 'http://localhost:5000/callback';
const scope = 'user-read-private user-read-email';

module.exports = { stateKey, client_id, redirect_uri, scope };