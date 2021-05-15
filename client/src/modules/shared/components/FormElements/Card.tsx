import { Card, CardContent, Divider, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import styled from 'styled-components';
import React from 'react';

interface FormCardProps {
    title?: string;
    form: JSX.Element;
    errorMessage?: string;
    extraContent?: JSX.Element;
}

const FormCard: React.FC<FormCardProps> = ({
    title = '',
    form,
    errorMessage = '',
    extraContent = null
}) => {
    return (
        <Card>
            <StyledFormContent>
                {title ? (
                    <StyledFormHeader>
                        <Typography variant="h4">{title}</Typography>
                    </StyledFormHeader>
                ) : null}
                {form}
                {errorMessage ? (
                    <StyledAlertSection>
                        <Alert severity="error">
                            <b>{errorMessage}</b>
                        </Alert>
                    </StyledAlertSection>
                ) : null}
                {extraContent ? (
                    <>
                        <StyledDivider />
                        <StyledOtherActionsSection>
                            {extraContent}
                        </StyledOtherActionsSection>
                    </>
                ) : null}
            </StyledFormContent>
        </Card>
    );
};

const StyledDivider = styled(Divider)`
    margin-top: ${props => props.theme.spacing(4)}px;
`;

const StyledFormContent = styled(CardContent)`
    padding: ${props => props.theme.spacing(4)}px;
`;

const StyledFormHeader = styled.div`
    margin-bottom: ${props => props.theme.spacing(3)}px;
`;

const StyledAlertSection = styled.div`
    margin-top: ${props => props.theme.spacing(2)}px;
    margin-bottom: ${props => props.theme.spacing()}px;
`;

const StyledOtherActionsSection = styled.div`
    margin-top: ${props => props.theme.spacing(3)}px;
`;

export default FormCard;
