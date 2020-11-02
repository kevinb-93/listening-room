import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import styled from 'styled-components';

import { useSpotifyContext } from '../context/spotify';
import AudioControls from '../../shared/components/audio/audio-controls';
import ProgressBar from '../../shared/components/UIElements/progress-bar';
import { useSpotifyPlayerContext } from '../context/player';

const Player: React.FC = () => {
    const {
        activeDeviceId,
        setActiveDevice,
        queue,
        playTrack,
    } = useSpotifyContext();
    const {
        playbackState,
        player,
        setPlayback,
        playerInstance,
    } = useSpotifyPlayerContext();

    const [elaspedTime, setElaspedTime] = useState<number>(
        playbackState?.position ?? 0
    );

    const [artistFullInfo, setArtistFullInfo] = useState<
        SpotifyApi.ArtistObjectFull
    >(null);

    useEffect(() => {
        // play next track
        if (
            queue.length &&
            playbackState?.duration - playbackState?.position < 500
        ) {
            const s = new SpotifyWebApi();
            s.play({ uris: [queue[0].uri] })
                .then(() => {
                    playTrack(queue[0]);
                })
                .catch((e) => console.error('Could not play track', e));
        }
    }, [
        elaspedTime,
        playTrack,
        playbackState?.duration,
        playbackState?.position,
        queue,
    ]);

    useEffect(() => {
        // if player is playing, update the progress
        let intervalId: number;

        if (playbackState?.paused === false) {
            intervalId = setInterval(() => {
                setElaspedTime((et) => et + 500);
            }, 500);
        } else if (
            playbackState?.paused ||
            elaspedTime > playbackState?.duration
        ) {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }

        return () => clearInterval(intervalId);
    }, [playbackState?.duration, playbackState?.paused, elaspedTime]);

    useEffect(() => {
        // update the elasped time to match the player position
        setElaspedTime(playbackState?.position ?? 0);
    }, [playbackState?.position]);

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
        <PlayerContainer>
            {/* <ArtistImg src={artistFullInfo?.images[0]?.url} /> */}
            <Album
                src={
                    playbackState.track_window.current_track.album.images[0].url
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
                elaspedTime={elaspedTime}
                songDurationMs={playbackState.duration}
            />
        </PlayerContainer>
    );
};

export interface StyledPlayer {
    backgroundImg: string;
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    color: #fff;
`;

const ArtistImg = styled.img`
    position: absolute;
    filter: brightness(0.3);
    width: 100%;
    height: auto;
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
    color: #fff;
    padding: 16px 0px 16px 0px;
`;

export default Player;
