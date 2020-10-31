import * as React from 'react';

import TrackList from '../../songs/components/song-list';
import TrackItem from '../../spotify/components/track-item';
import Player from '../../spotify/containers/player';
import { useSpotifyContext } from '../../spotify/context/spotify';

const Queue: React.FC = () => {
    const { queue, nowPlaying } = useSpotifyContext();

    if (!queue) {
        return null;
    }

    return (
        <div>
            {nowPlaying && <Player />}
            <TrackList>
                {queue.map((t) => (
                    <TrackItem track={t} key={t.id} />
                ))}
            </TrackList>
        </div>
    );
};

export default Queue;
