import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import styled from 'styled-components';

import { useSpotifyContext } from '../context/spotify';
import AudioControls from '../../shared/components/audio/audio-controls';
import ProgressBar from '../../shared/components/UIElements/progress-bar';

const Player: React.FC = () => {
    const { nowPlaying, activeDeviceId } = useSpotifyContext();

    const [artistFullInfo, setArtistFullInfo] = useState<
        SpotifyApi.ArtistObjectFull
    >(null);

    useEffect(() => {
        const s = new SpotifyWebApi();
        // s.play({
        //     uris: [nowPlaying.uri],
        //     ...(activeDeviceId && { device_id: activeDeviceId }),
        // })
        //     .then(() => {
        //     })
        //     .catch((e) => console.log(e));

        s.getArtist(nowPlaying.artists[0].id)
            .then((data) => {
                setArtistFullInfo(data);
            })
            .catch((e) => console.log(e));
    }, [nowPlaying.uri, activeDeviceId, nowPlaying.artists]);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const playHandler = () => setIsPlaying(true);

    const pauseHandler = () => setIsPlaying(false);

    return (
        <Container>
            <ArtistImg src={artistFullInfo?.images[0]?.url} />
            <PlayerContainer>
                <AudioControls
                    color="#fff"
                    isPlaying={isPlaying}
                    playHandler={playHandler}
                    pauseHandler={pauseHandler}
                />
                <ProgressBar
                    isPlaying={isPlaying}
                    elaspedTime={200}
                    songDurationMs={nowPlaying.duration_ms}
                />
            </PlayerContainer>
        </Container>
    );
};

export interface StyledPlayer {
    backgroundImg: string;
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 640px;
    width: 640px;
    position: relative;
    min-width: 300px;
    max-width: 640px;
`;

const ArtistImg = styled.img`
    position: absolute;
    filter: brightness(0.3);
    width: inherit;
    height: inherit;
`;

const PlayerContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 200px;
`;

export default Player;
