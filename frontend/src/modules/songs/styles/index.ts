import styled from 'styled-components';

export const StyledSongList = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0px 16px;
`;

export const StyledSongListItem = styled.div`
    border: 1px solid red;
    border-left-width: 0px;
    border-right-width: 0px;
    height: 70px;
    display: flex;
    align-items: center;
    padding: 8px;
    justify-content: space-between;

    & > div,
    img {
        padding: 0px 8px;
    }
`;

export const SongImage = styled.img``;

export const StyledSongDetails = styled.div`
    flex: 1 1;
    display: flex;
    flex-direction: column;
`;

export const StyledSongButtons = styled.div`
    align-self: flex-end;
    display: flex;
    font-size: 1.5rem;

    & > svg {
        padding: 0px 8px;
    }
`;
