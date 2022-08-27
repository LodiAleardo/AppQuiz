import Login from "./Login"
import ListTests from "../interface/ListTests"

import {useRoutes} from "react-router-dom";
import TestExecutor from "../test/TestExecutor";


function Routing() {

    const element = useRoutes([
        { path: "/", element: <ListTests /> },
        { path: "/login", element: <Login /> },
        { path: "/test", element: <ListTests /> },
        { path: "/do_test/:data/:nome", element: <TestExecutor /> },
    ]);
    return element;
}

export default Routing
