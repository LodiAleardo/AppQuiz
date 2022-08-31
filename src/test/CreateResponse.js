import arrayShuffle from 'array-shuffle';
import {Checkbox, FormControlLabel, Radio, TextField} from "@mui/material";
import React, {useState} from "react";

function CreateResponse(props) {
    let data = props.data;
    const [response, setResponse] = useState(data["text"]);
    const [valueResponse, setValueResponse] = useState(data["value"]);

    if(response!==data["text"]) setResponse(data["text"]);
    if(valueResponse!==data["value"]) setResponse(data["value"]);

    function setResponseText(val) {
        data["text"] = val;
        setResponse(val);
    }

    function setResponseValue(val) {
        data["value"] = val;
        setValueResponse(val);
    }

    return (
        <div  style={{display: 'inline'}}>
            <TextField id="outlined-basic"
                       label="Risposta"
                       type="text"
                       value={response}
                       onChange={e => setResponseText(e.target.value)}
                       variant="outlined"/>
            <TextField id="outlined-number"
                       value={valueResponse}
                       onChange={e => setResponseValue(e.target.value)}
                       InputProps={{inputProps: {min: 0, max: 10}}}
                       alabel="Punteggio"
                       type="number"/></div>
    );

}

export default CreateResponse