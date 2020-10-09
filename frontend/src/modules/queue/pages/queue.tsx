import * as React from 'react';

import TrackList from '../../songs/components/song-list';
import TrackListItem from '../../songs/components/song-list-item';

const Queue: React.FC = () => {
    return (
        <div>
            <TrackList>
                <TrackListItem />
                <TrackListItem />
            </TrackList>
        </div>
    );
};

export default Queue;
