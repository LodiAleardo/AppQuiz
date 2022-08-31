import {useParams} from "react-router-dom";
import {gql, useLazyQuery, useMutation, useQuery} from "@apollo/client";
import React, {useState} from "react";
import Responses from "./Responses";
import {Button, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup} from "@mui/material";
import * as PropTypes from "prop-types";

const OLD_TEST_RUNS = gql`query testRuns ($user: String) {
                            testRuns (user: $user) {
                                id
                                test {
                                    data
                                    nome
                                    ordineCasuale
                                    domandeConNumero
                                    domande {
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
                                }
                                risposte
                                dataInizio
                                dataUltimaRisposta
                            }
                        }`;

const GET_TEST_DATA = gql`query testByID ($data: String!, $nome: String!) {
                            testByID (data: $data, nome: $nome) {
                                data
                                nome
                                ordineCasuale
                                domandeConNumero
                                domande {
                                    nome
                                    testo
                                    punti
                                    ordineCasuale
                                    risposteConNumero
                                    risposte {
                                        id 
                                        testo
                                        # punteggio
                                    }
                                }
                            }}`;

const START_TEST = gql`mutation iniziaTest ($data: String!, $nome: String!) {
                            iniziaTest (data: $data, nome: $nome) {
                                id
                            }
                        }`;

const RISPONDI = gql`mutation rispondi ($test: ID!, $risposte: [ID!]!) {
                        rispondi (test: $test, risposte: $risposte) {
                            id
                        }
                    }`;


function FormContro(props) {
    return null;
}

FormContro.propTypes = {children: PropTypes.func};

function TestExecutor() {
    const {data} = useParams()
    const {nome} = useParams()
    let {responses} = useParams([])
    const [name, setName] = useState("No Name")
    const [questionNumber, setQuestionNumber] = useState(0)
    const [questions, setQuestions] = useState([])
    const [question, setQuestion] = useState({})
    const [oldResponses, setOldResponses] = useState([])

    const [ID, setID] = useState(0)
    const [completeData, setCompleteData] = useState({})
    const [value, setValue] = useState("");

    const [mutateFunction, {error_mutation, loading_mutation, data_mutation}] = useMutation(START_TEST, {
        variables: {data, nome},
        onCompleted(data_mutation) {
            setID(data_mutation.iniziaTest.id);
        }
    });

    const [mutateResponse, {error_response, loading_response, data_response}] = useMutation(RISPONDI, {
        variables: {
            test: ID,
            risposte: responses
        },
        onCompleted(data_response) {

        }

    });


    const [get_fresh_test_data, {loading, error, data_graphql}] = useLazyQuery(GET_TEST_DATA, {
        variables: {data, nome},
        onCompleted(data_graphql) {

            setName(data_graphql.testByID.nome);
            setQuestions(data_graphql.testByID.domande);
            randomizeAndSetQuestions(data_graphql.testByID.domande[0]);
            setCompleteData(data_graphql.testByID);

        }
    });

    const {ots_lad, ots_erro, ots_data} = useQuery(OLD_TEST_RUNS, {
        variables: {user: "docente"},
        onCompleted(ots_data) {
            console.log(ots_data.testRuns.length);
            if(ots_data.testRuns.length === 0){
                get_fresh_test_data().then(r => {});
                mutateFunction().then(r => {});

                return;
            }
            let maxGame = ots_data.testRuns.reduce((max, game) => max.dataInizio > game.dataInizio ? max : game);
            setID(maxGame.id);
            setOldResponses(maxGame.risposte);

            setName(maxGame.test.nome);


            setQuestions(maxGame.test.domande);
            randomizeAndSetQuestions(maxGame.test.domande[0]);
            setCompleteData(maxGame.test);

            if (maxGame.id === 0) {
                console.log("Qualcosa")
            }

            maxGame.test.domande[0].risposte.forEach((risposta, index) => {
                if (maxGame.risposte.includes(risposta.id)) {
                    setValue(risposta.id.toString());
                }
            });


        }
    });


    function handleSubmit(e) {
        e.preventDefault();

        let risposte = structuredClone(oldResponses);

        questions[questionNumber].risposte.forEach((risposta, index) => {
            if (risposte.includes(risposta.id)) risposte = risposte.filter(item => item !== risposta.id);

        });


        if (value !== undefined) {
            setOldResponses([...risposte, value]);

            mutateResponse({
                variables: {
                    test: ID,
                    risposte: [...risposte, value]
                },
            }).then(r => {
            });
        }

        questions[questionNumber + 1].risposte.forEach((risposta, index) => {
            if (risposte.includes(risposta.id)) {
                setValue(risposta.id.toString());
            }
        });
        setQuestionNumber(questionNumber + 1 % questions.length);
        randomizeAndSetQuestions(questions[questionNumber + 1 % questions.length])

    }

    function randomizeAndSetQuestions(question) {
        console.log(question);
        let domanda = structuredClone(question);
        if (question.ordineCasuale) {
            domanda.risposte = domanda.risposte.map(value => ({value, sort: Math.random()}))
                .sort((a, b) => a.sort - b.sort)
                .map(({value}) => value)
        }

        setQuestion(domanda);

    }



    const renderNumeroDomanda = () => {
        if (completeData.domandeConNumero) {
            return (<b>{questionNumber + 1}. </b>)
        }
        return (<div></div>)
    }

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    if (loading) return 'Loading...';
    if (ots_lad) return 'Loading...';

    return (
        <div>
            <h1>{name}</h1>
            {/*<h3>{renderNumeroDomanda()}{question.testo}</h3>*/}
            {/*<form onSubmit={handleSubmit}>*/}
            <FormControl onSubmit={handleSubmit}>
                <FormLabel>{renderNumeroDomanda()}{question.testo}</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                >
                    <Responses data={question} isRandom={question.ordineCasuale}/>
                </RadioGroup>
            </FormControl>

            <br/>
            <Button
                type="submit"
                fullWidth
                onClick={handleSubmit}
            >
                Submit
            </Button>

            {/*</form>*/}

        </div>
    );

}

export default TestExecutor