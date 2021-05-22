import React, { useCallback, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import Player from '../../shared/components/audio/audio.player';
import { useSpotifyPlayerContext } from '../../spotify/context/player';
import Chat from '../../chat/containers/chat';
import { useSpotifyIdentityContext } from '../../spotify/context/identity';
import Card from '@material-ui/core/Card';
import {
    Avatar,
    CardContent,
    CardHeader,
    Container,
    Grid,
    Typography,
    useMediaQuery
} from '@material-ui/core';
import SpotifyTrackList from '../../spotify/containers/spotify.track-list';
import QueueMusicIcon from '@material-ui/icons/QueueMusicRounded';
import SpotifyAuth from '../../spotify/containers/spotify.auth';
import { SpotifyPlayerReducerActionType } from '../../../modules/spotify/context/player/reducer/types';

const Queue: React.FC = () => {
    const { spotifyToken } = useSpotifyIdentityContext();
    const {
        player,
        queue,
        playbackState,
        dispatch
    } = useSpotifyPlayerContext();
    const theme = useTheme();
    const showChat = useMediaQuery(theme.breakpoints.up('md'));

    console.log('render');

    const resumePlayback = useCallback(() => {
        if (!player || !playbackState?.paused) {
            return;
        }

        player.resume().then(() => console.log('resumed!'));
    }, [playbackState?.paused, player]);

    const pausePlayback = useCallback(() => {
        if (!player) {
            return;
        }

        if (!playbackState?.paused) {
            player.pause().then(() => console.log('paused!'));
        }
    }, [playbackState?.paused, player]);

    const renderPlayer = useMemo(() => {
        const { current_track } = playbackState?.track_window || {};
        const isPlaybackPaused = playbackState?.paused ?? true;

        const handlePlayNext = () =>
            dispatch({
                type: SpotifyPlayerReducerActionType.setPlayNext,
                payload: true
            });

        return (
            <Grid item xs={12}>
                <Player
                    image={current_track?.album?.images[0]?.url}
                    controls={{
                        playControl: {
                            isPaused: isPlaybackPaused,
                            onPress: isPlaybackPaused
                                ? resumePlayback
                                : pausePlayback
                        },
                        playNextControl: {
                            isDisabled: !queue.length,
                            onPress: handlePlayNext
                        }
                    }}
                    creatorName={current_track?.artists[0]?.name ?? ''}
                    title={current_track?.name ?? ''}
                    progress={{
                        elaspedTime: playbackState?.position ?? 0,
                        songDurationMs: playbackState?.duration ?? 0
                    }}
                />
            </Grid>
        );
    }, [
        dispatch,
        pausePlayback,
        playbackState?.duration,
        playbackState?.paused,
        playbackState?.position,
        playbackState?.track_window,
        queue.length,
        resumePlayback
    ]);

    const renderQueuedTrackList = useCallback(() => {
        if (!queue?.length)
            return (
                <CardContent>
                    <Typography>Queue is empty.</Typography>
                </CardContent>
            );

        return <SpotifyTrackList tracks={queue} showIndex />;
    }, [queue]);

    const renderQueue = useMemo(() => {
        return (
            <Grid item xs={12}>
                <StyledCard>
                    <CardHeader
                        avatar={
                            <StyledAvatar>
                                <QueueMusicIcon />
                            </StyledAvatar>
                        }
                        title="Up Next"
                        titleTypographyProps={{ variant: 'h6' }}
                    />
                    {renderQueuedTrackList()}
                </StyledCard>
            </Grid>
        );
    }, [renderQueuedTrackList]);

    return (
        <StyledGridContainer>
            <StyledOverflowContainer>
                <StyledContainer>
                    <StyledMainContent container>
                        {spotifyToken ? (
                            <>
                                {renderPlayer}
                                {renderQueue}
                            </>
                        ) : (
                            <Grid item xs={12}>
                                <SpotifyAuth />
                            </Grid>
                        )}
                    </StyledMainContent>
                </StyledContainer>
            </StyledOverflowContainer>
            {showChat && <Chat />}
        </StyledGridContainer>
    );
};

const StyledGridContainer = styled.div`
    display: grid;
    overflow: hidden;
    grid-template-columns: 1fr auto;
    height: 100%;
`;

const StyledMainContent = styled(Grid)`
    display: flex;
    flex-direction: column;

    ${props => props.theme.breakpoints.up('sm')} {
        padding: ${props => props.theme.spacing(2)}px;
    }

    & > .MuiGrid-item {
        padding: ${props => props.theme.spacing(2)}px 0;
    }
`;

const StyledCard = styled(Card)``;

const StyledOverflowContainer = styled.div`
    overflow: auto;
`;

const StyledAvatar = styled(Avatar)`
    background-color: transparent;
    color: ${props => props.theme.palette.primary.main};
`;

const StyledContainer = styled(Container)``;

export default Queue;
