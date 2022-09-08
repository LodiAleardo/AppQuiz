import Login from "./Login"
import ListTests from "../interface/ListTests"

// import {Route, Router, Routes, useRoutes} from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import TestExecutor from "../test/TestExecutor";
import CreateTest from "../test/CreateTest";
import RisultatoTest from "../interface/RisultatoTests";


function Routing() {

    // const element = useRoutes([
    //     { path: "/", element: <ListTests /> },
    //     { path: "/login", element: <Login /> },
    //     { path: "/test", element: <ListTests /> },
    //     { path: "/create_test", element: <CreateTest /> },
    //     { path: "/do_test/:data/:nome", element: <TestExecutor /> },
    //     { path: "/risultati/:ID", element: <RisultatoTest /> },
    // ]);
    // return element;
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<ListTests/>} />
                <Route exact path="/login" element={<Login/>} />
                <Route exact path="/test" element={<ListTests/>} />
                <Route exact path="/create_test" element={<CreateTest/>} />
                <Route exact path="/do_test/:data/:nome" element={<TestExecutor/>} />
                <Route exact path="/risultati/:ID" element={<RisultatoTest/>} />
            </Routes>
        </BrowserRouter>
    );

}

export default Routing
