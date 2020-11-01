import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import styled from 'styled-components';

import { useSpotifyContext } from '../context/spotify';
import AudioControls from '../../shared/components/audio/audio-controls';
import ProgressBar from '../../shared/components/UIElements/progress-bar';
import { useSpotifyPlayerContext } from '../context/player';

const Player: React.FC = () => {
    const { activeDeviceId, setActiveDevice } = useSpotifyContext();
    const {
        playbackState,
        player,
        setPlayback,
        playerInstance,
    } = useSpotifyPlayerContext();

    const [artistFullInfo, setArtistFullInfo] = useState<
        SpotifyApi.ArtistObjectFull
    >(null);

    useEffect(() => {
        const artist =
            playbackState?.track_window.current_track.artists[0].name;
        const song = playbackState?.track_window.current_track.name;
        if (artist && song) {
            document.title = `${artist} - ${song}`;
        }
    }, [playbackState?.track_window.current_track]);

    useEffect(() => {
        if (!activeDeviceId && playerInstance?.device_id) {
            const s = new SpotifyWebApi();
            s.transferMyPlayback([playerInstance.device_id])
                .then(() => {
                    setActiveDevice(playerInstance.device_id);
                })
                .catch((e) => console.error('Could not transfer playback', e));
        }
    }, [activeDeviceId, playerInstance?.device_id, setActiveDevice]);

    useEffect(() => {
        player.getCurrentState().then((playback) => {
            setPlayback(playback);
        });
    }, [player, setPlayback]);

    useEffect(() => {
        const s = new SpotifyWebApi();
        // s.play({
        //     uris: [nowPlaying.uri],
        //     ...(activeDeviceId && { device_id: activeDeviceId }),
        // })
        //     .then(() => {
        //     })
        //     .catch((e) => console.log(e));

        if (
            playbackState?.track_window?.current_track?.artists[0].uri !==
            artistFullInfo?.uri
        ) {
            s.getArtist(
                playbackState.track_window.current_track.artists[0].uri.replace(
                    'spotify:artist:',
                    ''
                )
            )
                .then((data) => {
                    setArtistFullInfo(data);
                })
                .catch((e) => console.log(e));
        }
    }, [artistFullInfo?.uri, playbackState?.track_window]);

    const playHandler = () => {
        if (playbackState.paused) {
            player.resume().then(() => console.log('resumed!'));
        }
    };

    const pauseHandler = () => {
        if (!playbackState.paused) {
            player.pause().then(() => console.log('paused!'));
        }
    };

    if (!playbackState) {
        return null;
    }

    return (
        <Container>
            <ArtistImg src={artistFullInfo?.images[0]?.url} />
            <PlayerContainer>
                <Album
                    src={
                        playbackState.track_window.current_track.album.images[0]
                            .url
                    }
                    height={200}
                    width={200}
                />
                <ArtistName>
                    {playbackState.track_window.current_track.artists[0].name}
                </ArtistName>
                <SongTitle>
                    {playbackState.track_window.current_track.name}
                </SongTitle>
                <AudioControls
                    color="#fff"
                    isPlaying={!playbackState.paused}
                    playHandler={playHandler}
                    pauseHandler={pauseHandler}
                />
                <ProgressBar
                    isPlaying={!playbackState.paused}
                    elaspedTime={playbackState.position}
                    songDurationMs={playbackState.duration}
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
    color: #fff;
`;

const ArtistImg = styled.img`
    position: absolute;
    filter: brightness(0.3);
    width: inherit;
    height: inherit;
`;

const Album = styled.img`
    position: relative;
`;

const SongTitle = styled.span`
    color: inherit;
    position: relative;
`;

const ArtistName = styled.span`
    color: inherit;
    position: relative;
`;

const PlayerContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 200px;
`;

export default Player;
