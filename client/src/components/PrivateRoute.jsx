import React from "react";
import { Route } from "react-router-dom";
import { Login } from "./Login/Login";

export function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            element={localStorage.getItem("user") ? <Component /> : <Login />}
        />
    );
}
