import React, { useState } from 'react';
import ListTests from "../interface/ListTests";

async function loginUser(credentials) {
    console.log(credentials);
    return fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(async response => {
        const status = response.headers.get("status");
        if (status === 200){
            console.log(response.json());
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
    localStorage.removeItem('token');

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            username,
            password
        });
        console.log(token)
        if (token){
            return (<ListTests />);

        }

    }

    return(
    <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Login
