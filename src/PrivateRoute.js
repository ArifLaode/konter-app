import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function PrivateRoute({ element: Component, ...rest }) {
    const token = localStorage.getItem('token');
    return (
        token ? <Component {...rest} /> : <Navigate to="/login" />
    );
}

export default PrivateRoute;
