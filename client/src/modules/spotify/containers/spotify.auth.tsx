import React from 'react';

import { useSpotifyIdentityContext } from '../context/identity';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Typography
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const SpotifyAuth: React.FC = () => {
    const { loginSpotify } = useSpotifyIdentityContext();

    const spotifyAuthHandler = () => {
        const url = `https://qsong.com:5000/api/spotify/login`;
        const width = 450,
            height = 730,
            left = screen.width / 2 - width / 2,
            top = screen.height / 2 - height / 2;

        const w = window.open(
            url,
            'Spotify',
            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
                width +
                ', height=' +
                height +
                ', top=' +
                top +
                ', left=' +
                left
        );

        window.addEventListener(
            'message',
            event => {
                if (event.origin !== 'https://qsong.com:5000') {
                    return;
                }

                const hash = JSON.parse(event.data);
                if (
                    Object.prototype.hasOwnProperty.call(hash, 'access_token')
                ) {
                    w?.close();

                    const tokenExpiration = new Date(
                        new Date().getTime() + 1000 * hash.expires_in
                    );

                    loginSpotify(
                        hash.access_token,
                        hash.refresh_token,
                        tokenExpiration
                    );
                }
            },
            false
        );
    };

    return (
        <Card>
            <CardHeader
                titleTypographyProps={{ variant: 'h6' }}
                title="Connect your Spotify Account"
            ></CardHeader>
            <CardContent>
                <Typography variant="body2">
                    This app requires your permission in order to access data
                    from your account and the Spotify platform. Please follow
                    the link below where you will be redirected to the
                    authorisation page.
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    variant="text"
                    size="medium"
                    endIcon={<ArrowForwardIcon />}
                    color="primary"
                    onClick={spotifyAuthHandler}
                >
                    Connect Spotify Account
                </Button>
            </CardActions>
        </Card>
    );
};

export default SpotifyAuth;
