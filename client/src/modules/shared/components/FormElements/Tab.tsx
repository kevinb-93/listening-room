import React from 'react';
import styled from 'styled-components';

export interface FormTabProps {
    active?: boolean;
    onTabClick: () => void;
}

const FormTab: React.FC<FormTabProps> = ({ active, onTabClick, children }) => {
    return (
        <StyledTab onClick={onTabClick} active={active}>
            {children}
        </StyledTab>
    );
};

FormTab.defaultProps = {
    active: false
};

interface StyledFormTab {
    active: boolean;
}

const StyledTab = styled.div<StyledFormTab>`
    display: flex;
    flex: 1;
    justify-content: center;
    background-color: ${({ active }) => (active ? '#fff' : '#000')};
    height: 100px;
    border-radius: 30px;
    padding-top: 13px;
    color: ${({ active }) => (active ? '#000' : '#fff')};
`;

export default FormTab;
