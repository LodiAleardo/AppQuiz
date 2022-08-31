import React from 'react';

import './App.css';
import jwt_decode from "jwt-decode";
import Routing from "./utilities/Routes";
import {AppBar, Box, Button, ListItemText, Menu, MenuItem, TextField, Toolbar, Typography} from "@mui/material";


function App() {
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

        } catch (e) {
            isExpired = true;
        }
    }


    if (window.location.pathname !== "/login" && isExpired) {
        sessionStorage.removeItem('token');
        window.location.href = "/login";

        return (<h1>Session ended, returning to login page</h1>);
    }

    const renderNumero = () => {
        if (token === null) {
            return "Not logged in";
        }
        return "Logged in";
    }


    return (
        <div>
            <AppBar position="static">
                <Toolbar>

                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Test suite
                    </Typography>

                    {renderNumero()}

                </Toolbar>
            </AppBar>
            <Routing/>
        </div>
    )
        ;
}

export default App;
