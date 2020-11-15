import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import styled from 'styled-components';
import * as Yup from 'yup';

import { useApiRequest } from '../../shared/hooks/api-hook';
import { useIdentityContext } from '../../shared/contexts/identity';
import SpotifyAuth from '../../spotify/containers/auth';
import Button from '../../shared/components/FormElements/button';

interface PartyForm {
    name: string;
    code?: string;
}

interface FormTab {
    active: boolean;
}

interface FormTabs {
    create: FormTab;
    join: FormTab;
}

enum PartyMember {
    Guest,
    Host,
}

const Login: React.FC = () => {
    const { login, spotifyToken } = useIdentityContext();

    const [memberType, setMemberType] = useState(PartyMember.Guest);

    const getValidationSchema = useCallback(() => {
        let validationSchema: Yup.ObjectSchema<
            PartyForm,
            Record<string, unknown>
        >;
        if (memberType === PartyMember.Host) {
            validationSchema = Yup.object<PartyForm>({
                name: Yup.string().required('Required'),
            });
        } else {
            validationSchema = Yup.object<PartyForm>({
                name: Yup.string().required('Required'),
                code: Yup.string().required('Required'),
            });
        }

        return validationSchema;
    }, [memberType]);

    const [validationSchema, setValidationSchema] = useState<
        Yup.ObjectSchema<PartyForm, Record<string, unknown>>
    >(getValidationSchema());

    const isSubmittable = useCallback(() => {
        if (!spotifyToken && memberType === PartyMember.Host) {
            return false;
        } else {
            return true;
        }
    }, [memberType, spotifyToken]);

    // const [tabs, setTabs] = useState<FormTabs>({
    //     create: { active: false },
    //     join: { active: true },
    // });

    const [submitDisabled, setSubmitDisabled] = useState<boolean>(
        isSubmittable()
    );

    useEffect(() => {
        setSubmitDisabled(!isSubmittable());
    }, [isSubmittable]);

    useEffect(() => {
        setValidationSchema(getValidationSchema());
    }, [getValidationSchema]);

    const { sendRequest } = useApiRequest();

    const submitHandler = async ({ name, code }: PartyForm) => {
        if (!isSubmittable()) {
            setSubmitDisabled(true);
            return;
        }

        const endpoint =
            memberType === PartyMember.Host ? 'create' : `join/${code}`;

        try {
            const response = await sendRequest(`party/${endpoint}`, {
                data: {
                    name,
                },
                method: 'POST',
            });
            login(response.data.token, null);
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    };

    // const authTypeHandler = () => {
    //     setAuthType(
    //         authType === AuthTypes.Guest ? AuthTypes.Host : AuthTypes.Guest
    //     );
    // };

    // const getAuthBtnTxt = () => {
    //     return authType === AuthTypes.Host ? 'Join Party' : 'Create Party';
    // };

    // const getPartyType = () => {
    //     return authType === AuthTypes.Guest ? 'Join Party' : 'Create Party';
    // };

    const TabHandler = (memberType: PartyMember) => {
        // set active tab
        setMemberType(memberType);
    };

    const initialValues: PartyForm = { name: '', code: '' };

    return (
        <Container>
            <StyledTabsForm>
                <StyledTabContainer>
                    <StyledTab
                        onClick={() => TabHandler(PartyMember.Guest)}
                        active={memberType === PartyMember.Guest}
                    >
                        <StyledTabText>Join</StyledTabText>
                    </StyledTab>
                    <StyledTab
                        onClick={() => TabHandler(PartyMember.Host)}
                        active={memberType === PartyMember.Host}
                    >
                        <StyledTabText>Create</StyledTabText>
                    </StyledTab>
                </StyledTabContainer>
                <FormContainer>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={submitHandler}
                        validationSchema={validationSchema}
                    >
                        <StyledForm>
                            <StyledFormInputSection>
                                <StyledFormGroup>
                                    <StyledLabel htmlFor="name">
                                        Name
                                    </StyledLabel>
                                    <Field
                                        name="name"
                                        type="text"
                                        as={StyledInput}
                                    />
                                    <StyledErrorMessage>
                                        <ErrorMessage name="name" />
                                    </StyledErrorMessage>
                                </StyledFormGroup>
                                {memberType === PartyMember.Guest && (
                                    <StyledFormGroup>
                                        <StyledLabel htmlFor="code">
                                            Party Code
                                        </StyledLabel>
                                        <Field
                                            name="code"
                                            type="text"
                                            as={StyledInput}
                                        />
                                        <StyledErrorMessage>
                                            <ErrorMessage name="code" />
                                        </StyledErrorMessage>
                                    </StyledFormGroup>
                                )}
                                {memberType === PartyMember.Host && (
                                    <StyledFormGroup>
                                        <SpotifyAuth />
                                    </StyledFormGroup>
                                )}
                            </StyledFormInputSection>
                            <StyledFormGroup>
                                <Button disabled={submitDisabled}>
                                    <span>Submit</span>
                                </Button>
                            </StyledFormGroup>
                        </StyledForm>
                    </Formik>
                </FormContainer>
            </StyledTabsForm>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    align-items: flex-start;
`;

const FormContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    margin-top: -50px;
    width: 300px;
    background-color: #fff;
    padding: 0px 30px 30px 30px;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.4);
    border-radius: 30px;
`;

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

const StyledFormGroup = styled.div`
    display: flex;
    padding: 8px;
    align-items: stretch;
    flex-direction: column;
`;

const StyledLabel = styled.label`
    flex: 1 0;
    margin-bottom: 8px;
`;

const StyledInput = styled.input`
    flex: 1;
`;

const StyledErrorMessage = styled.small`
    margin-top: 4px;
`;

const StyledTabContainer = styled.div`
    display: flex;
    width: 100%;
`;

interface StyledTab {
    active: boolean;
}

const StyledTab = styled.div<StyledTab>`
    display: flex;
    flex: 1;
    justify-content: center;
    background-color: ${(props) => (props.active ? '#fff' : '#000')};
    height: 100px;
    border-radius: 30px;
    padding-top: 13px;
    color: ${(props) => (props.active ? '#000' : '#fff')};
`;

const StyledTabText = styled.span`
    font-weight: bold;
`;

const StyledTabsForm = styled.div`
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px 0px;
`;

export default Login;
