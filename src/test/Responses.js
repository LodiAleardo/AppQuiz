import arrayShuffle from 'array-shuffle';
import {Checkbox, FormControlLabel, Radio} from "@mui/material";
import React from "react";

function Responses(props) {
    let data = props.data.risposte;
    let isRandom = props.isRandom || false;
    let corrette = props.corrette || [];
    let numero = 0;

    const renderNumero = () => {
        if (props.data.risposteConNumero) {
            numero = numero + 1;
            return (<b>{numero}. </b>)
        }
        return (<div></div>)
    }

    function RispostaCorretta(id) {
        if(corrette.length === 0) return (<span></span>)
        if(corrette.includes(id)) return (<span style={{backgroundColor: "#90ee90"}}>Corretta</span>);

        return (<span style={{backgroundColor: "red"}}>Errata</span>)
    }


    const risposte = data?.map((data) =>
        <div key={data.id}>{renderNumero()}<FormControlLabel control={<Radio/>}
                                                             // style={{color: "red"}}
                                                             label={data.testo}
                                                             name={data.id}
                                                             value={data.id}

        />{RispostaCorretta(data.id)}
        </div>
    );

    return (
        <div>{risposte}</div>
    );

}

export default Responses