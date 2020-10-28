import * as React from 'react';

import TrackList from '../../songs/components/song-list';
import TrackItem from '../../spotify/components/track-item';
import { useSpotifyContext } from '../../spotify/context/spotify';

const Queue: React.FC = () => {
    const { queue } = useSpotifyContext();

    if (!queue) {
        return null;
    }

    return (
        <div>
            <TrackList>
                {queue.map((t) => (
                    <TrackItem track={t} key={t.id} />
                ))}
            </TrackList>
        </div>
    );
};

export default Queue;
