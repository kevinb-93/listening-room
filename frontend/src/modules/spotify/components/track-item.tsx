import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDurationMs } from '../../shared/utils/datetime';
import { useSpotifyContext } from '../context/spotify';
import { SetSpotifyQueueParams } from '../context/spotify/types';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
    track: SpotifyApi.TrackObjectFull;
}

const TrackItem: React.FC<Props> = ({ track }) => {
    const { queue, actions } = useSpotifyContext();

    const isQueued = queue.some((q) => q.id === track.id);
    const queueAction: SetSpotifyQueueParams['action'] = isQueued
        ? 'delete'
        : 'add';
    const queueIcon: IconProp = isQueued ? 'times' : 'plus';

    return (
        <div key={track.id} style={{ display: 'flex' }}>
            <img
                height={64}
                width={64}
                src={track.album.images.find((i) => i.height === 64).url}
            ></img>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <span>{track.name}</span>
                <span>{track.artists.map((a) => a.name).join(', ')}</span>
                <span>{convertDurationMs(track.duration_ms)}</span>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <span
                    onClick={() =>
                        actions.setQueue({
                            action: queueAction,
                            tracks: [track],
                        })
                    }
                >
                    <FontAwesomeIcon fixedWidth icon={queueIcon} />
                </span>
                <span>
                    <FontAwesomeIcon fixedWidth icon={'play'} />
                </span>
            </div>
        </div>
    );
};

export default TrackItem;
