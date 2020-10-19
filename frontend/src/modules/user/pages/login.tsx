import React from 'react';
// import SpotifyWebApi from 'spotify-web-api-js';

import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from '../../shared/utils/validators';
// import { useIdentityContext } from '../context/identity/index';
import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/input';
import { useApiRequest } from '../../shared/hooks/api-hook';
import { useIdentityContext } from '../../shared/contexts/identity';

const Login: React.FC = () => {
    const { actions } = useIdentityContext();

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

    // const spotifyLoginHandler = () => {
    //     const url = `http://localhost:5000/login`;
    //     const width = 450,
    //         height = 730,
    //         left = screen.width / 2 - width / 2,
    //         top = screen.height / 2 - height / 2;

    //     const w = window.open(
    //         url,
    //         'Spotify',
    //         'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
    //             width +
    //             ', height=' +
    //             height +
    //             ', top=' +
    //             top +
    //             ', left=' +
    //             left
    //     );

    //     window.addEventListener(
    //         'message',
    //         (event) => {
    //             if (event.origin !== 'http://localhost:5000') {
    //                 return;
    //             }

    //             const hash = JSON.parse(event.data);
    //             if (
    //                 Object.prototype.hasOwnProperty.call(hash, 'access_token')
    //             ) {
    //                 w.close();
    //                 const spotifyApi = new SpotifyWebApi();
    //                 spotifyApi.setAccessToken(hash.access_token);
    //                 actions.setSpotifyIdentity({
    //                     access_token: hash.access_token,
    //                     refresh_token: hash.refresh_token,
    //                 });
    //             }
    //         },
    //         false
    //     );
    // };

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
};

export default Login;
