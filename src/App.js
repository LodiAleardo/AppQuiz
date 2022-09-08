import React from 'react';

import './App.css';
import Routing from "./utilities/Routes";
import {AppBar, Box, Button, ListItemText, Menu, MenuItem, TextField, Toolbar, Typography} from "@mui/material";
import checkIfLoggedIn from "./UserState";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ListTests from "./interface/ListTests";
import Login from "./utilities/Login";
import CreateTest from "./test/CreateTest";
import TestExecutor from "./test/TestExecutor";
import RisultatoTest from "./interface/RisultatoTests";

function App() {
    checkIfLoggedIn();

    const renderState = () => {
        const state = checkIfLoggedIn();
        console.log(state)
        if(state.sub) return "Logged in";

        return "Not logged in";
    }


    return (
        <div>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Test suite
                    </Typography>
                    {renderState()}

                </Toolbar>

            </AppBar>

            <Routing />

        </div>
    );
}

export default App;
