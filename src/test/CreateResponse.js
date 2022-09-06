import {Checkbox, FormControlLabel, Grid, IconButton, Radio, TextField} from "@mui/material";
import React, {useState} from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

function CreateResponse(props) {
    let data = props.data;
    let removeRow = props.function;
    const [response, setResponse] = useState(data["text"]);
    const [valueResponse, setValueResponse] = useState(data["value"]);


    function setResponseText(val) {
        data["text"] = val;
        setResponse(val);
    }

    function setResponseValue(val) {
        data["value"] = val;
        setValueResponse(val);
    }

    if(response!==data["text"]) setResponseText(data["text"]);
    if(valueResponse!==data["value"]) setResponseValue(data["value"]);

    return (
        // <div  style={{display: 'inline'}}>
            <Grid container spacing={2} margin={0}>
                <Grid item xs={6}>
                    <TextField id="outlined-basic"
                               label="Risposta"
                               type="text"
                               fullWidth
                               value={response}
                               onChange={e => setResponseText(e.target.value)}
                               variant="outlined"/>

                </Grid>
                <Grid item xs={3}>
                    <TextField id="outlined-number"
                               value={valueResponse}
                               fullWidth
                               onChange={e => setResponseValue(e.target.value)}
                               InputProps={{inputProps: {min: 0, max: 1}}}
                               label="Punteggio"
                               type="number"/>

                </Grid>
                <Grid item xs={1}>
                    <IconButton size="small" onClick={() => {
                        removeRow(data.id)
                    }}>
                        <RemoveCircleOutlineIcon fontSize="small"/>
                    </IconButton>

                </Grid>
            </Grid>
        // </div>
    );

}

export default CreateResponse