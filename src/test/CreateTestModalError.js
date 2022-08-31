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

function CreateModalsErrors(props) {
    let data = props.data;
    let triggerClose = props.triggerClose;

    return (
        <Modal
            open={data}
            onClose={triggerClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Errore nei dati inseriti
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 2}}>
                    La domanda o alcune risposte sono vuote. Per favore compila i campi correttamente.
                </Typography>
            </Box>
        </Modal>
    );
}

export default CreateModalsErrors