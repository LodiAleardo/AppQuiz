import {Link} from "react-router-dom";
import {Box, Button, Grid} from "@mui/material";
import React from "react";

function TestObject(props) {
    const {data, close} = props


    var listItems = data.map((data) =>
        <section style={{display: "contents"}}>
            <Grid item xs={8}>
                <Box m={2}>
                    Test name: <strong>{data.nome}</strong> created in data: <strong>{data.data}</strong>
                </Box>
            </Grid>
            <Grid item xs={4}>
                <Box m={1}>

                    <Button component={Link} to={`/do_test/${data.data}/${data.nome}`} variant="text" color="primary">
                        AL TEST
                    </Button>

                </Box>

            </Grid>
        </section>
    );

    if (data.length === 0) {
        listItems = (<li key="NoTest">Non hai test da compilare</li>)
    }

    return (
        <Grid container spacing={2}>
            {listItems}
        </Grid>

    );

}

export default TestObject