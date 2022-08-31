import arrayShuffle from 'array-shuffle';
import {Box, Button, Checkbox, FormControlLabel, Modal, Radio, TextField, Typography} from "@mui/material";
import React, {useState} from "react";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function CreateTestModalClose(props) {
    let data = props.data;
    let triggerClose = props.triggerClose;

    const sendDataAndClose = function (e) {
        alert('it works!');
        e.preventDefault();
    }

    return (
        <Modal
            open={data}
            onClose={triggerClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <form
                onSubmit={sendDataAndClose}
                autoComplete="off"
            >

            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Inserisci il nome del test e il punteggio massimo. La domanda non verrá salvata
                </Typography>
                <TextField id="filled-basic" type="text" required label="Nome del test" variant="filled" />
                <br/>
                <br/>
                <TextField id="filled-basic" type="number" required label="Punti" variant="filled" />
                <br/>
                <Button type="submit" variant="outlined">
                    Save
                </Button>

            </Box>
            </form>
        </Modal>

    );

}

export default CreateTestModalClose