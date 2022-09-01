import React, {useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import TestObject from "./TestObject";
import checkIfLoggedIn from "../UserState";

const GET_TESTS = gql`query tests {
    tests {
        data
        nome
    }}`;

function ListTests() {
    const [testsListData, setTestsData] = useState()
    const {loading, error, data} = useQuery(GET_TESTS, {
        onCompleted(data) {
            setTestsData(data)
        }
    });
    if (loading) return null;
    if (error) return `Error! ${error}`;

    function createTestButton() {
        const state = checkIfLoggedIn();
        console.log(state)
        if(!state.docente) return (<div></div>)

        return (<a href="/create_test">Crea un test</a>)
    }

    return (
        <div>
            <h1>Test list</h1>
            <TestObject data={testsListData.tests}/>
            {createTestButton()}
        </div>
    );

}

export default ListTests