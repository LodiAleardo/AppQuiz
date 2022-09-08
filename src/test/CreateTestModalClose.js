import arrayShuffle from 'array-shuffle';
import {Box, Button, Checkbox, FormControlLabel, Modal, Radio, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {gql, useMutation} from "@apollo/client";
import {v4 as uuidv4} from "uuid";

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

const CREA_TEST = gql`mutation creaTest ($test: TestInput!) {
                            creaTest (test: $test) {
                                data
                            }
                        }`;


function CreateTestModalClose(props) {
    let data = props.data;
    let triggerClose = props.triggerClose;
    const [existsThisName, setExistsThisName] = useState(false);
    const [helperText, setHelperText] = useState("");
    const [ordineCasuale, setOrdineCasuale] = useState(false);
    const [domandeConNumero, setDomandeConNumero] = useState(false);

    const [nomeDelTest, setNomeDelTest] = useState("");

    const [creaTest, {err_tst, load_tst, data_tst}] = useMutation(CREA_TEST, {
        onCompleted(data_tst) {
            // console.log(data_tst);
            if(data_tst.creaTest === null){
                setExistsThisName(true);
                setHelperText("Devi cambiare il nome del test, esiste giá.");
                return;
            }
            window.location.href = "/test";

        }
    });

    const sendDataAndClose = function (e) {
        e.preventDefault();
        creaTest({
            variables: {
                "test": {
                    "nome": nomeDelTest,
                    "ordineCasuale": ordineCasuale,
                    "domandeConNumero": domandeConNumero,
                    "domande": props.domande
                }
            },
        }).then(r => {
        });

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
                        Inserisci il nome del test e il punteggio massimo. Questa domanda non verrá salvata.
                    </Typography>
                    <br/>
                    <TextField id="filled-basic"
                               type="text"
                               required
                               fullWidth
                               label="Nome del test"
                               variant="filled"
                               error={existsThisName}
                               value={nomeDelTest}
                               helperText={helperText}
                               onChange={e => setNomeDelTest(e.target.value)}
                    />

                    <FormControlLabel control={<Checkbox/>}
                                      label="Ordine casuale delle domande"
                                      value={ordineCasuale}
                                      onChange={e => setOrdineCasuale(!ordineCasuale)}
                    />
                    <FormControlLabel control={<Checkbox/>}
                                      label="Domande con numero"
                                      value={domandeConNumero}
                                      onChange={e => setDomandeConNumero(!domandeConNumero)}
                    />

                    <br/>
                    <br/>
                    <Button type="submit" variant="outlined">
                        Salva e pubblica il test
                    </Button>

                </Box>
            </form>
        </Modal>

    );

}

export default CreateTestModalClose