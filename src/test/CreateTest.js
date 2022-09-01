import {useParams} from "react-router-dom";
import React, {useState} from "react";
import {Box, Button, Checkbox, FormControlLabel, IconButton, TextField} from "@mui/material";
import CreateResponse from "./CreateResponse";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import CreateModalsErrors from "./CreateTestModalError";
import {gql, useMutation} from "@apollo/client";
import {v4 as uuidv4} from 'uuid';
import CreateTestModalClose from "./CreateTestModalClose";

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

function CreateTest() {
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

        for(var i in response){
            if(response[i].value === "1") empty_value = false;
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
        return (<div><Button variant="contained" onClick={() => openModalCloseEditing()}>Pubblica il test</Button></div>)
    }


    function renderRisposte() {

        return response.map((data) =>
            <div key={data.id}>
                <CreateResponse data={data}/>
                <IconButton size="small" onClick={() => {
                    removeRow(data.id)
                }}>
                    <RemoveCircleOutlineIcon fontSize="small"/>
                </IconButton>
            </div>
        );
    }

    return (
        <div>
            <CreateModalsErrors data={modalErrorState} triggerClose={handleCloseModalErrors}/>
            <CreateTestModalClose data={modalCloseState}
                                  triggerClose={handleCloseModalState}
                                  domande={listDomande}/>
            <div>Crea le domande</div>
            <Box
                component="form"
                // sx={{
                //     '& > :not(style)': {m: 1, width: '50%'},
                // }}
                noValidate
                autoComplete="off"
            >
                <TextField id="outlined-basic"
                           label="Question"
                           variant="outlined"
                           value={question}
                           onChange={e => setQuestion(e.target.value)}/>
                <FormControlLabel control={<Checkbox/>}
                                  label="Ordine casuale"
                                  checked={ordineCasuale}
                                  onChange={e => setCasualOrder(!ordineCasuale)}
                />
                <FormControlLabel control={<Checkbox/>}
                                  label="Risposte con numero"
                                  checked={risposteConNumero}
                                  onChange={e => setResponseWithNumber(!risposteConNumero)}/>


            </Box>
            {renderRisposte()}
            <IconButton size="small" onClick={() => {
                addRow()
            }}>
                <AddIcon fontSize="small"/>
            </IconButton>

            <br/><br/><br/>
            <div>
                <Button variant="contained" onClick={() => openModalErrorsOrContinue()}>Save and continue</Button><br/><br/>
                {/*<Button variant="contained" onClick={() => openModalCloseEditing()}>Pubblica il test</Button><br/><br/>*/}
                {renderButtonSendTest()}
            </div>

        </div>

    );

}

export default CreateTest