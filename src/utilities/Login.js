import React, {useState} from 'react';
import ListTests from "../interface/ListTests";
import {Box, Button, Grid, TextField} from "@mui/material";

async function loginUser(credentials) {
    // console.log(credentials);
    return fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(async response => {
        const status = response.headers.get("status");
        if (status === 200) {
            // console.log(response.json());
            sessionStorage.setItem('token', "OK");
        }
        const data = await response.json();
        sessionStorage.setItem('token', data.token);
        window.location.href = "/test";

        return true;
    });
}

function Login() {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    sessionStorage.removeItem('token');

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            username,
            password
        });
        // console.log(token)
        if (token) {
            return (<ListTests/>);

        }

    }

    return (
        <Box component="div" display="flex" flexDirection="column" alignItems="stretch" padding={1}
             sx={{
                 // boxShadow: 3,
                 // width: '25%',
                 // height: '25%',
                 // bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                 // color: (theme) =>
                 //     theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                 p: 1,
                 m: 1,
                 borderRadius: 2,
                 textAlign: 'center',
                 //     fontSize: '0.875rem',
                 //     fontWeight: '700',
             }}
        >

            <div className="login-wrapper">
                <h1>Please Log In</h1>
                <form onSubmit={handleSubmit}>
                    <TextField id="standard-basic" label="Username" variant="standard"
                               type="text" onChange={e => setUserName(e.target.value)}/>
                    <br/>
                    <br/>
                    <TextField id="standard-basic" label="Password" variant="standard"
                               type="password" onChange={e => setPassword(e.target.value)}/>

                    <div>
                        <br/>
                        <Button type="submit" variant="contained">Log in</Button>
                    </div>
                </form>
            </div>

        </Box>

    )
}

export default Login
