import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
    children,
    ...props
}) => {
    return <StyledButton {...props}>{children}</StyledButton>;
};

const StyledButton = styled.button`
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;

    &:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
`;

export default Button;
