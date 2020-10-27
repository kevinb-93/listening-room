import React from 'react';
import { convertDurationMs } from '../../shared/utils/datetime';

interface Props {
    track: SpotifyApi.TrackObjectFull;
}

const TrackItem: React.FC<Props> = ({ track }) => {
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
        </div>
    );
};

export default TrackItem;
