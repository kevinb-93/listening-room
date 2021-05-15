import React from 'react';
import styled from 'styled-components';
import { Button as MuiButton, ButtonProps } from '@material-ui/core';

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    return <MuiButton {...props}>{children}</MuiButton>;
};

// const StyledButton = styled(MuiButton)`
//     border-radius: 15px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     padding: 4px;
//     margin-top: ${({ theme }) => theme.spacing(2)}px;

//     /* &:hover {
//         box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2),
//             0 6px 20px 0 rgba(0, 0, 0, 0.19);
//     } */
// `;

export default Button;
