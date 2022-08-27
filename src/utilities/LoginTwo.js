import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {gql, useMutation} from '@apollo/client';

export const LOGIN_USER = gql`
    mutation Login($userSignin:UserSigninInput!){
        user:signinUser(userSignin:$userSignin){
            token
        }
    }
`


export function LoginTwo() {
    const navigate = useNavigate()
    const [state, setState] = useState({
        email: '',
        password: ''
    })
    const [signinUser, {error, loading, data}] = useMutation(LOGIN_USER, {
        onCompleted(data) {
            localStorage.setItem("token", data.user.token)
            console.log("Login SuccessFully")
            navigate('/profile')
        },
        onError() {
            console.log(error)
            console.log("User doesn't exists with this email")
        }
    })
    if (loading) return <h1>Loading</h1>

    const handleChangeInput = (key, value) => {
        setState({
            ...state,
            [key]: value
        })
    }

    const renderInput = (type = 'text', id, label, value) => {
        return (
            <div>
                <input
                    id={id}
                    label={label}
                    // value={value}
                    type={type}
                    onChange={handleChangeInput}
                />
            </div>
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        signinUser({
            variables: {
                userSignin: state
            }
        })

    }

    return (
        <div>
            <h1 className="text-3xl text-center mt-7 font-black dark:text-slate-200">Log in</h1>
            <div className="p-8">
                <form onSubmit={handleSubmit}>
                    {renderInput('text', 'email', 'Email', state.email)}
                    {renderInput('password', 'password', 'Password', state.password)}
                    <button action={"Login"} actionType={"primary"}>Login</button>
                </form>
            </div>
        </div>
    )
}
