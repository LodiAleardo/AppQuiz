import React from 'react';

import jwt_decode from "jwt-decode";

function checkIfLoggedIn() {
    var isExpired = true;

    const token = sessionStorage.getItem("token");
    if (token !== null) {
        try {
            const decoded = jwt_decode(token);
            const dateNow = new Date();
            const expiration = new Date(decoded.exp);
            isExpired = false;
            if (dateNow < expiration) {
                isExpired = true;
            }

            return decoded;
        } catch (e) {
            isExpired = true;
        }
    }


    if (window.location.pathname !== "/login" && isExpired) {
        sessionStorage.removeItem('token');
        window.location.href = "/login";

        return (<h1>Session ended, returning to login page</h1>);
    }

    return {};
}

export default checkIfLoggedIn;
