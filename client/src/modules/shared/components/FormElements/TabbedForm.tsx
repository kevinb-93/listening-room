import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FormTab from './Tab';

export interface TabForm {
    tabText: string;
    form: JSX.Element;
}

export type TabbedForms = [TabForm, TabForm];

export interface TabbedFormProps {
    tabbedForms: TabbedForms;
}

const TabbedForm: React.FC<TabbedFormProps> = ({ tabbedForms }) => {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

    const [activeForm, setActiveForm] = useState<TabForm['form']>(
        tabbedForms[0].form
    );

    const tabHandler = (index: number) => {
        setActiveTabIndex(index);
    };

    useEffect(() => {
        setActiveForm(tabbedForms[activeTabIndex].form);
    }, [activeTabIndex, tabbedForms]);

    return (
        <StyledTabsForm>
            <StyledTabContainer>
                {tabbedForms.map((t, i) => {
                    return (
                        <FormTab
                            key={i}
                            onTabClick={() => tabHandler(i)}
                            active={i === activeTabIndex}
                        >
                            <StyledTabText>{t.tabText}</StyledTabText>
                        </FormTab>
                    );
                })}
            </StyledTabContainer>
            <FormContainer>{activeForm}</FormContainer>
        </StyledTabsForm>
    );
};

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

const StyledTabContainer = styled.div`
    display: flex;
    width: 100%;
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

export default TabbedForm;
