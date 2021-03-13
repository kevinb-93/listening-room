import React from 'react';
import { RouteProps, Route, Redirect } from 'react-router-dom';
import useAppIdentity from '../../shared/hooks/use-identity';

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
    const { isLoggedIn } = useAppIdentity();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                isLoggedIn ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/auth',
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
