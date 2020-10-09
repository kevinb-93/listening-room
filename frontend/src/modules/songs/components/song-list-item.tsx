import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import image from '../../shared/assets/images/Radiohead.okcomputer.albumart.jpg';

import {
    StyledSongListItem,
    SongImage,
    StyledSongDetails,
    StyledSongButtons,
} from '../styles';

const SongListItem: React.FC = () => {
    return (
        <StyledSongListItem>
            <SongImage height={65} src={image} />
            <StyledSongDetails>
                <span>Let Down</span>
                <span>OK Computer</span>
                <span>4:32</span>
            </StyledSongDetails>
            <StyledSongButtons>
                <FontAwesomeIcon fixedWidth icon={'plus'} />
                <FontAwesomeIcon fixedWidth icon={'times'} />
            </StyledSongButtons>
        </StyledSongListItem>
    );
};

export default SongListItem;
