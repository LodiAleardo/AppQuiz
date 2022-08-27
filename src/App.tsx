import React from 'react';

import './App.css';
import jwt_decode from "jwt-decode";
import Routing from "./utilities/Routes";
import {useNavigate} from "react-router-dom";


function App() {
    var isExpired = true;
    const token = sessionStorage.getItem("token");
    if (token !== null) {
        const decoded: any = jwt_decode(token);
        var dateNow = new Date();
        const expiration = new Date(decoded.exp);
        isExpired = false;
        if (dateNow < expiration) {
            isExpired = true;
        }
    }


    if (window.location.pathname !== "/login" && isExpired) {
        sessionStorage.removeItem('token');
        return (<h1>Session ended, return to login page</h1>);
    }

    return (
        <Routing/>
    );
}

export default App;
