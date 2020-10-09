import React from 'react';

import { StyledSongList } from '../styles';

const SongList: React.FC = ({ children }) => {
    return <StyledSongList>{children}</StyledSongList>;
};

export default SongList;
