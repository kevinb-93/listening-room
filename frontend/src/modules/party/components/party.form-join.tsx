/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';

import Button from '../../shared/components/FormElements/Button';
import { TextField } from 'formik-material-ui';

interface JoinPartyFormValues {
    partyCode: string;
}

export type JoinPartySubmit = (
    values: JoinPartyFormValues
) => void | Promise<void>;

export interface Party {
    id: string;
    name: string;
}

interface JoinPartyFormProps {
    onSubmit: JoinPartySubmit;
    submitDisabled?: boolean;
    partyList?: Party[];
}

const validationSchema = Yup.object<JoinPartyFormValues>({
    partyCode: Yup.string().required('required')
});

const JoinPartyForm: React.FC<JoinPartyFormProps> = ({
    onSubmit,
    submitDisabled
}) => {
    const initialValues: JoinPartyFormValues = {
        partyCode: ''
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {() => (
                <StyledForm>
                    <StyledFormInputSection>
                        <Field
                            name="partyCode"
                            type="text"
                            margin="normal"
                            label="Party Code"
                            autoFocus
                            component={TextField}
                        />
                    </StyledFormInputSection>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={submitDisabled}
                    >
                        Join
                    </Button>
                </StyledForm>
            )}
        </Formik>
    );
};

const StyledForm = styled(Form)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;
    align-items: stretch;
`;

const StyledFormInputSection = styled.div`
    display: flex;
    align-items: stretch;
    flex-direction: column;
    justify-content: center;
    padding: 8px;
`;

JoinPartyForm.defaultProps = {
    submitDisabled: false
};

export default JoinPartyForm;
