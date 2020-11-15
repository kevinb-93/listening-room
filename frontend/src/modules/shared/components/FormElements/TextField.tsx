import React from 'react';
import styled from 'styled-components';
import MUITextField, { TextFieldProps } from '@material-ui/core/TextField';

const TextField: React.FC<TextFieldProps> = ({ ...props }) => {
    return <StyledTextField {...props} />;
};

const StyledTextField = styled(MUITextField)``;

export default TextField;
