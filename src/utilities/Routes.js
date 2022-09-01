import Login from "./Login"
import ListTests from "../interface/ListTests"

import {useRoutes} from "react-router-dom";
import TestExecutor from "../test/TestExecutor";
import CreateTest from "../test/CreateTest";
import RisultatoTest from "../interface/RisultatoTests";


function Routing() {

    const element = useRoutes([
        { path: "/", element: <ListTests /> },
        { path: "/login", element: <Login /> },
        { path: "/test", element: <ListTests /> },
        { path: "/create_test", element: <CreateTest /> },
        { path: "/do_test/:data/:nome", element: <TestExecutor /> },
        { path: "/risultati/:ID", element: <RisultatoTest /> },
    ]);
    return element;
}

export default Routing
