import queryString from 'querystring';
import axios, { AxiosRequestConfig } from 'axios';
import { Response, Request, NextFunction } from 'express';

import spotify from '../../shared/utils/spotify';
import secret from '../../shared/config/secret';
import { generateRandomString } from '../../shared/utils/string';
import HttpError from '../../shared/models/http-error.model';

export const login = (req: Request, res: Response) => {
    const state = generateRandomString(16);
    res.cookie(spotify.stateKey, state);

    const params = queryString.stringify({
        response_type: 'code',
        client_id: spotify.clientId,
        scope: spotify.scope,
        redirect_uri: spotify.redirectUri,
        state: state
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
                    error: 'state_mismatch'
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
                    grant_type: 'authorization_code'
                }),
                {
                    headers: {
                        Authorization:
                            'Basic ' +
                            Buffer.from(
                                spotify.clientId + ':' + secret.SPOTIFY_CLIENT
                            ).toString('base64')
                    }
                }
            )
            .then(response => {
                if (response.status === 200) {
                    const accessToken = response.data.access_token;
                    const refreshToken = response.data.refresh_token;
                    const expiresIn = response.data.expires_in;

                    res.redirect(
                        `/spotify-auth.html#${queryString.stringify({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                            expires_in: expiresIn
                        })}`
                    );
                }
            })
            .catch(() => {
                res.redirect(
                    `/spotify-auth.html#${queryString.stringify({
                        error: 'invalid_token'
                    })}`
                );
            });
    }
};

export const refreshToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // requesting access token from refresh token
    const refreshToken = req.query.refresh_token;
    const config: AxiosRequestConfig = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization:
                'Basic ' +
                Buffer.from(
                    spotify.clientId + ':' + secret.SPOTIFY_CLIENT
                ).toString('base64')
        }
    };

    axios
        .post(
            'https://accounts.spotify.com/api/token',
            queryString.stringify({
                grant_type: 'refresh_token',
                refresh_token: refreshToken as string
            }),
            config
        )
        .then(response => {
            if (response.status === 200) {
                res.send({
                    access_token: response.data.access_token,
                    expires_in: response.data.expires_in
                });
            }
        })
        .catch(() => {
            next(
                new HttpError('Something went wrong refreshing the token.', 500)
            );
        });
};
