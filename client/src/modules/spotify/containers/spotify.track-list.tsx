import List from '@material-ui/core/List';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { convertDurationMs } from '../../shared/utils/datetime';
import { useSpotifyPlayerContext } from '../context/player';
import { getArtists, getTrackImage } from '../utils/track';
import TrackItem, {
    TrackItemProps
} from '../components/spotify.track-list-item';

export interface SpotifyTrackListProps {
    tracks: SpotifyApi.TrackObjectFull[];
}

const SpotifyTrackList: React.FC<SpotifyTrackListProps> = ({ tracks }) => {
    const {
        player,
        queue,
        addTrackToQueue,
        deleteTrackFromQueue,
        playTrack,
        playbackState
    } = useSpotifyPlayerContext();

    const isTrackQueued = useCallback(
        (trackId: SpotifyApi.TrackObjectFull['id']) => {
            return queue.some(q => q.id === trackId);
        },
        [queue]
    );

    const isCurrentTrack = useCallback(
        (id: string) => {
            return playbackState?.track_window?.current_track?.id === id;
        },
        [playbackState?.track_window?.current_track?.id]
    );

    const isTrackPlaying = useCallback(
        (id: SpotifyApi.TrackObjectFull['id']) => {
            return isCurrentTrack(id) && playbackState?.paused === false;
        },
        [isCurrentTrack, playbackState?.paused]
    );

    const getTrack = useCallback(
        (trackId: string) => {
            return tracks.find(t => t.id === trackId);
        },
        [tracks]
    );

    const pressPlaybackHandler = useCallback(
        (id: string) => {
            const track = getTrack(id);

            if (!isCurrentTrack(id)) {
                playTrack(track);
            } else {
                player.togglePlay();
            }
        },
        [getTrack, isCurrentTrack, playTrack, player]
    );

    const queueTrackHandler = useCallback(
        (id: string) => {
            const isQueued = isTrackQueued(id);

            if (isQueued) {
                deleteTrackFromQueue(id);
            } else {
                const track = getTrack(id);
                addTrackToQueue(track);
            }
        },
        [addTrackToQueue, deleteTrackFromQueue, getTrack, isTrackQueued]
    );

    const trackItems = tracks?.slice(0, 10).map(t => {
        const track: TrackItemProps['track'] = {
            id: t.id,
            artist: getArtists(t),
            duration: convertDurationMs(t.duration_ms),
            songTitle: t.name
        };
        const image: TrackItemProps['image'] = {
            src: getTrackImage(t).url,
            size: 64
        };

        const isQueued = isTrackQueued(t.id);
        const isPlaying = isTrackPlaying(t.id);

        return (
            <TrackItem
                onPressPlayback={pressPlaybackHandler}
                onQueueTrack={queueTrackHandler}
                isQueued={isQueued}
                isPlaying={isPlaying}
                isCurrentTrack={isCurrentTrack(t.id)}
                track={track}
                image={image}
                key={t.id}
            />
        );
    });

    if (!trackItems) {
        return null;
    }

    return <StyledTrackList>{trackItems}</StyledTrackList>;
};

const StyledTrackList = styled(List)`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

export default SpotifyTrackList;
