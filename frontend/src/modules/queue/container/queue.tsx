import React, { useCallback, useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import styled from 'styled-components';
import Search from '../../shared/components/FormElements/search';

import TrackList from '../../songs/components/song-list';
import TrackItem from '../../spotify/components/track-item';
import Player from '../../spotify/containers/player';
import { useSpotifyPlayerContext } from '../../spotify/context/player';
import { useSpotifyContext } from '../../spotify/context/spotify';

const Queue: React.FC = () => {
    const { queue } = useSpotifyContext();
    const { player } = useSpotifyPlayerContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResponseData, setSearchResponseData] = useState<
        SpotifyApi.SearchResponse
    >();

    const searchHandler = useCallback((searchTerm: string) => {
        const s = new SpotifyWebApi();

        s.search(searchTerm, ['track'], { market: 'from_token' }).then(
            (data) => {
                setSearchResponseData(data);
            },
            (err) => {
                console.log(err);
            }
        );
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setSearchResponseData(null);
        }
    }, [searchTerm]);

    const renderTracks = () => {
        return (
            <>
                {searchResponseData
                    ? searchResponseData.tracks.items.slice(0, 10).map((t) => {
                          return <TrackItem track={t} key={t.id} />;
                      })
                    : queue.map((t) => <TrackItem track={t} key={t.id} />)}
            </>
        );
    };

    useEffect(() => {
        if (searchTerm) {
            const timer = setTimeout(() => searchHandler(searchTerm), 1000);
            return () => clearTimeout(timer);
        }
    }, [searchTerm, searchHandler]);

    const changeHandler = (searchTerm: string) => {
        setSearchTerm(searchTerm);
        console.log('search change handler');
    };

    const clearHandler = () => {
        setSearchTerm('');
    };

    return (
        <Container>
            {player && <Player />}
            {queue && (
                <QueueContainer>
                    <SearchContainer>
                        <Search
                            onChange={changeHandler}
                            searchTerm={searchTerm}
                            onClear={clearHandler}
                        />
                    </SearchContainer>
                    <TrackList>{renderTracks()}</TrackList>
                </QueueContainer>
            )}
        </Container>
    );
};

const Container = styled.div`
    display: grid;
    margin: 0 auto;
    grid-gap: 1rem;
    background-color: green;
    justify-items: center;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const QueueContainer = styled.div`
    justify-self: stretch;
`;

const SearchContainer = styled.div`
    justify-self: stretch;
`;

export default Queue;
