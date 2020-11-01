const stateKey = 'spotify_auth_state';
const clientId = '7a0f28849e5247838ce0161501c98e4f';
const redirectUri = 'http://localhost:5000/api/spotify/callback';
const scope =
    'user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming';

export default { stateKey, clientId, redirectUri, scope };
