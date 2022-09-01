import React, {useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import TestObject from "./TestObject";
import {useParams} from "react-router-dom";
import Responses from "../test/Responses";
import {FormControlLabel, Radio, RadioGroup} from "@mui/material";

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

function RisultatoTest() {
    const [testData, setTestsData] = useState({})
    const {ID} = useParams()

    const {loading, error, data} = useQuery(GET_RISULTATO, {
        variables: {"id": ID},
        onCompleted(data) {
            setTestsData(data)
            console.log(data);
        }
    });
    if (loading) return null;
    if (error) return `Error! ${error}`;

    function punteggioTotale() {
        var sum = 0;
        var total = 0;
        for (let i = 0; i < data.risultati.length; i ++) {
            sum = sum + parseFloat(data.risultati[i].punteggio);
            total = total + parseFloat(data.risultati[i].domanda.punti);
        }

        return (<h1>Hai ricevuto {sum} su {total}</h1>)
    }

    const risposte = data.risultati?.map((data) =>
        <div>{data.domanda.testo}
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={data.date[0]}>

                <Responses data={data.domanda}/>
            </RadioGroup>
            <br/>
        </div>
    );


    return (
        <div>
            {punteggioTotale()}
            <div>
                {risposte}
            </div>

            <a href="/test">Return to homepage</a>
        </div>
    );

}

export default RisultatoTest