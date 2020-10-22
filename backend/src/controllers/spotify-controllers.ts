import queryString from 'querystring';
import axios from 'axios';

import spotify from '../utils/spotify';
import secret from '../utils/secret';
import { generateRandomString } from '../utils/string';
import { Response, Request } from 'express';

export const login = (req: Request, res: Response) => {
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
        client_id: spotify.clientId,
        scope: spotify.scope,
        redirect_uri: spotify.redirectUri,
        state: state,
    });

    // request spotify authorization
    res.redirect(`https://accounts.spotify.com/authorize?${params}`);
};

export const callback = (req: Request, res: Response) => {
    // request refresh and access tokens after checking state param

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[spotify.stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect(
            '/#' +
                queryString.stringify({
                    error: 'state_mismatch',
                })
        );
    } else {
        res.clearCookie(spotify.stateKey);

        axios
            .post(
                'https://accounts.spotify.com/api/token',
                queryString.stringify({
                    code: code as string,
                    redirect_uri: spotify.redirectUri,
                    grant_type: 'authorization_code',
                }),
                {
                    headers: {
                        Authorization:
                            'Basic ' +
                            Buffer.from(
                                spotify.clientId +
                                    ':' +
                                    secret.spotifyClientSecret
                            ).toString('base64'),
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    const accessToken = response.data.access_token;
                    const refreshToken = response.data.refresh_token;

                    res.redirect(
                        `/spotify-auth.html#${queryString.stringify({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        })}`
                    );

                    // axios.get("https://api.spotify.com/v1/me", {
                    //     headers: { 'Authorization': 'Bearer ' + access_token }
                    // }).then((response) => {
                    //     console.log(response.data);
                    // });
                }
            })
            .catch(() => {
                res.redirect(
                    `/spotify-auth.html#${queryString.stringify({
                        error: 'invalid_token',
                    })}`
                );
            });
    }
};
