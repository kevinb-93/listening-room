import React from 'react';
import styled from 'styled-components';
import { TextField as MuiTextField, TextFieldProps } from 'formik-material-ui';

const TextField: React.FC<TextFieldProps> = ({ ...props }) => {
    return <StyledTextField {...props} />;
};

const StyledTextField = styled(MuiTextField)``;

export default TextField;
