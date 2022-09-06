import React, {useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import TestObject from "./TestObject";
import checkIfLoggedIn from "../UserState";
import {Box} from "@mui/material";

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
        if (!state.docente) return (<div></div>)

        return (<a href="/create_test">Crea un test</a>)
    }

    return (
        <Box component="div" display="flex" flexDirection="column" alignItems="stretch" padding={1}
             sx={{
                 // boxShadow: 3,
                 // width: '25%',
                 // height: '25%',
                 bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                 color: (theme) =>
                     theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                 p: 1,
                 m: 2,
                 borderRadius: 2,
                 textAlign: 'left',
                 //     fontSize: '0.875rem',
                 //     fontWeight: '700',
             }}
        >

            <div>
                <h1>Test list</h1>
                <TestObject data={testsListData.tests}/>
                {createTestButton()}
            </div>
        </Box>
    );

}

export default ListTests