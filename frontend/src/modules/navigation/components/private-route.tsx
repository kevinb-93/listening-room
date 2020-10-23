import React from 'react';
import { RouteProps, Route, Redirect } from 'react-router-dom';
import { useIdentityContext } from '../../shared/contexts/identity';

// screen if you're not yet authenticated.
const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
    const { token } = useIdentityContext();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                token ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
