import React from 'react';

import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
} from '../../shared/utils/validators';
import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/input';
import { useApiRequest } from '../../shared/hooks/api-hook';
import { useIdentityContext } from '../../shared/contexts/identity';
import SpotifyAuth from '../../spotify/containers/auth';

const Login: React.FC = () => {
    const { actions, token, spotifyToken } = useIdentityContext();

    const [formState, inputHandler] = useForm(
        {
            name: {
                value: '',
                isValid: false,
            },
        },
        false
    );
    const { sendRequest } = useApiRequest();

    const loginSubmitHandler = async () => {
        event.preventDefault();

        try {
            const response = await sendRequest('/users/login', {
                data: {
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value,
                },
                method: 'POST',
            });
            actions.login(response.data.token, null);
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    };

    if (!token) {
        return (
            <>
                <h2>Login</h2>
                <form onSubmit={loginSubmitHandler}>
                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-Mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address"
                        onInput={inputHandler}
                    />
                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password, at least 6 characters."
                        onInput={inputHandler}
                    />
                </form>
                <button onClick={loginSubmitHandler}>Login</button>
            </>
        );
    } else if (!spotifyToken) {
        return <SpotifyAuth />;
    }
};

export default Login;
