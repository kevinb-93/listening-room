import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { useIdentityContext } from '../context/identity/index';

const Login: React.FC = () => {
    const { actions } = useIdentityContext();

    const handleLoginClick = () => {
        const url = `http://localhost:5000/login`;
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
            (event) => {
                if (event.origin !== 'http://localhost:5000') {
                    return;
                }

                const hash = JSON.parse(event.data);
                if (
                    Object.prototype.hasOwnProperty.call(hash, 'access_token')
                ) {
                    w.close();
                    const spotifyApi = new SpotifyWebApi();
                    spotifyApi.setAccessToken(hash.access_token);
                    actions.setSpotifyIdentity({
                        access_token: hash.access_token,
                        refresh_token: hash.refresh_token,
                    });
                }
            },
            false
        );
    };

    return (
        <>
            <p>Login</p>
            <button onClick={handleLoginClick}>Login</button>
        </>
    );
};

export default Login;
