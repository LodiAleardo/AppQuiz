import React, {useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import TestObject from "./TestObject";
import {Link, useParams} from "react-router-dom";
import Responses from "../test/Responses";
import {Box, Button, FormControlLabel, Grid, Radio, RadioGroup} from "@mui/material";

const GET_RISULTATO = gql`query risultati ($id: ID) {
    risultati (id: $id) {
        domanda {
            nome
            testo
            punti
            ordineCasuale
            risposteConNumero
            risposte {
                id
                testo
                punteggio
            }
        }
        punteggio
        corrette
        date
    }
}`;

function RisultatoTest({position}) {
    const {state} = useParams()
    const [testData, setTestsData] = useState({})
    const {ID} = useParams()

    const {loading, error, data} = useQuery(GET_RISULTATO, {
        variables: {"id": ID},
        onCompleted(data) {
            setTestsData(data)
        }
    });
    if (loading) return null;
    if (error) return `Error! ${error}`;

    function punteggioTotale() {
        var sum = 0;
        var total = 0;
        for (let i = 0; i < data.risultati.length; i++) {
            sum = sum + parseFloat(data.risultati[i].punteggio);
            total = total + parseFloat(data.risultati[i].domanda.punti);
        }

        return (<h1>Hai ricevuto {sum} su {total}</h1>)
    }

    function RispostaCorrettaOMeno(data, corrette) {
        if (corrette.includes(data)) {
            return (<h4><span style={{backgroundColor: "#90ee90"}}>Risposta corretta</span></h4>);
        }
        return (<h4><span style={{backgroundColor: "red"}}>Risposta errata</span></h4>);
    }


    const risposte = data.risultati?.map((data) =>
        <Box component="div"
             display="flex"
             justifyContent="center"
             flexDirection="column"
             alignItems="stretch"
             padding={2}
             key={data.domanda.nome}
        >


            <Grid container spacing={2}>
                <Grid item xs={"auto"}>
                    <h3>{data.domanda.testo}</h3>
                </Grid>
                <Grid item xs={"auto"}>
                    {RispostaCorrettaOMeno(data.date[0], data.corrette)}
                </Grid>
            </Grid>

            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={data.date[0]}>

                <Responses data={data.domanda} corrette={data.corrette}/>

            </RadioGroup>
            <br/>
        </Box>
    );


    return (
        <div>
            {punteggioTotale()}
            <div>
                {risposte}
            </div>
            <Box component="div"
                 display="flex"
                 justifyContent="center"
                 flexDirection="column"
                 // alignItems="stretch"
                 padding={2}
            >

                <Button component={Link} to="/test" variant="outlined" color="primary">
                    Ritorna alla lista dei test
                </Button>
            </Box>
        </div>
    );

}

export default RisultatoTest