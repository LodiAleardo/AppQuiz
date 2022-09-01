import React from 'react';

import './App.css';
import Routing from "./utilities/Routes";
import {AppBar, Box, Button, ListItemText, Menu, MenuItem, TextField, Toolbar, Typography} from "@mui/material";
import checkIfLoggedIn from "./UserState";

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
            <AppBar>
                <Toolbar>

                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Test suite
                    </Typography>

                    {renderState()}

                </Toolbar>
            </AppBar>
            <Routing state="Ciao" />
        </div>
    )
        ;
}

export default App;
