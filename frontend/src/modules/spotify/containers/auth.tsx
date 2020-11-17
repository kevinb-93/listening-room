import React from 'react';
import styled from 'styled-components';

import { useIdentityContext } from '../../shared/contexts/identity';
import img from '../../shared/assets/logos/spotify/Spotify_Logo_RGB_Black.png';
import Button from '../../shared/components/FormElements/Button';

const SpotifyAuthButton: React.FC = () => {
    const { spotifyLogin, spotifyToken } = useIdentityContext();

    const spotifyAuthHandler = () => {
        const url = `http://localhost:5000/api/spotify/login`;
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

                    const tokenExpiration = new Date(
                        new Date().getTime() + 1000 * hash.expires_in
                    );

                    spotifyLogin(
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
        <Button onClick={() => spotifyAuthHandler()}>
            <StyledImg width={70} src={img} />
            <span>{spotifyToken ? 'authorized!' : 'authorise'}</span>
        </Button>
    );
};

const StyledImg = styled.img`
    margin: 10px;
`;

export default SpotifyAuthButton;
