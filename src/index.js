import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink
} from '@apollo/client';
import {BrowserRouter} from "react-router-dom";
import {setContext} from "@apollo/client/link/context";

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/graphql',
});


const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = sessionStorage.getItem('token');

    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    // link: httpLink, // Chain it with the HttpLink
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

root.render(
    <React.StrictMode>
        {/*<BrowserRouter>*/}
            <ApolloProvider client={client}>
                <App/>
            </ApolloProvider>
        {/*</BrowserRouter>*/}
    </React.StrictMode>
)
;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
