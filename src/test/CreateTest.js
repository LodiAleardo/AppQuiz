import {useParams} from "react-router-dom";
import React, {useState} from "react";
import {Box, Button, Checkbox, FormControlLabel, Grid, IconButton, TextField} from "@mui/material";
import CreateResponse from "./CreateResponse";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import CreateModalsErrors from "./CreateTestModalError";
import {gql, useMutation} from "@apollo/client";
import {v4 as uuidv4} from 'uuid';
import CreateTestModalClose from "./CreateTestModalClose";
import checkIfLoggedIn from "../UserState";
import * as PropTypes from "prop-types";

const CREA_DOMANDA = gql`mutation creaDomanda ($domanda: DomandaInput!) {
                            creaDomanda (domanda: $domanda) {
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
                        }`;

function Item(props) {
    return null;
}

Item.propTypes = {children: PropTypes.node};

function CreateTest() {
    const state = checkIfLoggedIn();
    if (!state.docente) {
        sessionStorage.removeItem('token');
        window.location.href = "/login";
    }

    const [listDomande, setListaDomande] = useState([])

    const [question, setQuestion] = useState("")
    const [maxValue, setMaxValue] = useState(2)
    const [modalErrorState, setModalErrorState] = useState(false);
    const handleCloseModalErrors = () => setModalErrorState(false);

    const [modalCloseState, setModalCloseState] = useState(false);
    const handleCloseModalState = () => setModalCloseState(false);

    const [ordineCasuale, setCasualOrder] = useState(false)
    const [risposteConNumero, setResponseWithNumber] = useState(false)
    const [response, setResponse] = useState([{"text": "", "id": 0, "value": 0},
        {"text": "", "id": 1, "value": 0}]);

    const [creaDomanda, {err_cd, load_cd, data_cd}] = useMutation(CREA_DOMANDA, {
        // variables: {data, nome},
        onCompleted(data_cd) {
            console.log(data_cd);
            setListaDomande([...listDomande, data_cd.creaDomanda.nome]);
            setResponse([{"text": "", "id": 0, "value": 0},
                {"text": "", "id": 1, "value": 0}]);
            setCasualOrder(false);
            setResponseWithNumber(false);
            setCasualOrder(false);
            setMaxValue(2);
            setQuestion("");

        }
    });

    function openModalCloseEditing() {
        setModalCloseState(true);
    }


    function openModalErrorsOrContinue() {
        let empty_response = response.some(item => item.text === "");
        let empty_value = true;

        for (var i in response) {
            if (response[i].value === "1") empty_value = false;
        }

        if (!question || empty_response || empty_value) {
            setModalErrorState(true);
            return;
        }
        let risposte = []
        for (var i in response) {
            risposte.push({
                "testo": response[i].text,
                "punteggio": response[i].value
            });
        }

        creaDomanda({
            variables: {
                "domanda": {
                    "nome": uuidv4(),
                    "testo": question.toString(),
                    "punti": 1,
                    "ordineCasuale": ordineCasuale,
                    "risposteConNumero": risposteConNumero,
                    "risposte": risposte
                }
            },
        }).then(r => {
        });


    }

    function removeRow(id) {
        if (response.length === 2)
            return
        let theRemovedElement = response.filter(item => item.id !== id); // theRemovedElement == 1
        setResponse(theRemovedElement);
    }

    function addRow() {
        let theRemovedElement = [...response, {"text": "", "id": maxValue, "value": 0}]
        setResponse(theRemovedElement);
        setMaxValue(maxValue + 1);
    }

    const renderButtonSendTest = () => {
        if (listDomande.length === 0) {
            return (<div></div>)
        }
        return (
            <Button color="success" variant="contained" onClick={() => openModalCloseEditing()}>Pubblica il test</Button>)
    }


    function renderRisposte() {

        return response.map((data) =>
            <Box component="div"
                 display="flex"
                 justifyContent="center"
                 flexDirection="column"
                 key={data.id}
            >

                <CreateResponse data={data} function={removeRow}/>
            </Box>
        );
    }

    return (
        <div>
            <CreateModalsErrors data={modalErrorState} triggerClose={handleCloseModalErrors}/>
            <CreateTestModalClose data={modalCloseState}
                                  triggerClose={handleCloseModalState}
                                  domande={listDomande}/>
            <h1>Crea le domande</h1>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{
                    boxShadow: 3,
                    width: 'auto',
                    p: 2,
                    m: 3,
                    borderRadius: 2,
                }}

            >
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField id="outlined-basic"
                                   label="Domanda"
                                   variant="outlined"
                                   fullWidth
                                   value={question}
                                   onChange={e => setQuestion(e.target.value)}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControlLabel control={<Checkbox/>}
                                                  label="Ordine casuale"
                                                  checked={ordineCasuale}
                                                  onChange={e => setCasualOrder(!ordineCasuale)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel control={<Checkbox/>}
                                                  label="Risposte con numero"
                                                  checked={risposteConNumero}
                                                  onChange={e => setResponseWithNumber(!risposteConNumero)}/>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>


                {/*<br/>*/}


                <br/>
                {renderRisposte()}

                <Box margin={2}>
                    <IconButton size="small" onClick={() => {
                        addRow()
                    }}>Aggiungi una nuova risposta
                        <AddIcon fontSize="small"/>
                    </IconButton>
                </Box>
                <br/>

                <div>
                    <Box component="div"
                         display="flex"
                         justifyContent="center"
                         flexDirection="column"
                        // alignItems="stretch"
                         padding={2}
                    >

                        <Button variant="contained" onClick={() => openModalErrorsOrContinue()}>Save and
                            continue</Button>

                        <br/><br/>
                        {renderButtonSendTest()}

                    </Box>
                </div>
            </Box>


        </div>

    );

}

export default CreateTest