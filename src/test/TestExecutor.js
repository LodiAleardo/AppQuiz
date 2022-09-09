import {useParams} from "react-router-dom";
import {gql, useLazyQuery, useMutation, useQuery} from "@apollo/client";
import React, {useState} from "react";
import Responses from "./Responses";
import {Box, Button, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup} from "@mui/material";
import * as PropTypes from "prop-types";
import checkIfLoggedIn from "../UserState";

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

const TERMINA = gql`mutation termina ($test: ID!) {
    termina (test: $test) {
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

    const [mutateTermina, {error_termina, loading_termina, data_termina}] = useMutation(TERMINA, {
        variables: {ID},
        onCompleted(data_mutation) {
            window.location.href = "/risultati/" + ID;
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
            let single_test_data = structuredClone(data_graphql.testByID);

            single_test_data.domande = randomizeAndSetQuestions(single_test_data);
            randomizeAndSetResponses(single_test_data.domande[0]);
            setCompleteData(single_test_data);

        }
    });
    const {ots_lad, ots_erro, ots_data} = useQuery(OLD_TEST_RUNS, {
        variables: {user: checkIfLoggedIn().sub},
        onCompleted(ots_data) {
            // console.log(ots_data);

            if (ots_data.testRuns.length === 0) {
                get_fresh_test_data().then(r => {
                });
                mutateFunction().then(r => {
                });

                return;
            }

            var tmp_arr = ots_data.testRuns.filter(t => t.test.nome === nome && t.test.data === data);
            if (tmp_arr.length === 0) {
                get_fresh_test_data().then(r => {
                });
                mutateFunction().then(r => {
                });

                return;
            }

            tmp_arr = tmp_arr.reduce((max, game) => max.dataInizio > game.dataInizio ? max : game);
            // console.log(tmp_arr)

            let single_test_data = structuredClone(tmp_arr);
            setID(single_test_data.id);
            setOldResponses(single_test_data.risposte);


            single_test_data.test.domande = [...randomizeAndSetQuestions(single_test_data.test)];
            randomizeAndSetResponses(single_test_data.test.domande[0]);
            setCompleteData(single_test_data.test);

            if (single_test_data.id === 0) {
                // console.log("Qualcosa")
            }

            single_test_data.test.domande[0].risposte.forEach((risposta, index) => {
                if (single_test_data.risposte.includes(risposta.id)) {
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

        if (questionNumber + 1 === questions.length) {
            mutateTermina({
                variables: {
                    test: ID,
                },
            }).then(r => {
            });
            return;
        }


        questions[questionNumber + 1].risposte.forEach((risposta, index) => {
            if (risposte.includes(risposta.id)) {
                setValue(risposta.id.toString());
            }
        });
        setQuestionNumber(questionNumber + 1);
        setQuestion(questions[questionNumber + 1])

    }

    function randomizeAndSetResponses(question) {
        let domanda = structuredClone(question);
        if (question.ordineCasuale) {
            domanda.risposte = domanda.risposte.map(value => ({value, sort: Math.random()}))
                .sort((a, b) => a.sort - b.sort)
                .map(({value}) => value)
        }

        setQuestion(domanda);
    }

    function randomizeAndSetQuestions(question) {
        let domande = structuredClone(question.domande);

        if (question.ordineCasuale) {
            domande = domande.map(value => ({value, sort: Math.random()}))
                .sort((a, b) => a.sort - b.sort)
                .map(({value}) => value)
        }

        setQuestions(domande);
        return domande;
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
        <Box component="div" display="flex" justifyContent="center" flexDirection="column" alignItems="stretch"
             padding={1}
             sx={{
                 boxShadow: 3,
                 width: 'auto',
                 // height: '25%',
                 // bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                 // color: (theme) =>
                 //     theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                 p: 2,
                 m: 3,
                 borderRadius: 2,
                 textAlign: 'left',

                 //     fontSize: '0.875rem',
                 //     fontWeight: '700',
             }}
        >
            {/*<h1>{name}</h1>*/}

            <FormControl onSubmit={handleSubmit}>
                <FormLabel>{renderNumeroDomanda()}{question.testo}</FormLabel>
                <Box component="div"
                     display="flex"
                     justifyContent="center"
                     flexDirection="column"
                     alignItems="stretch"
                     padding={2}
                >

                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                    >
                        <Responses data={question} isRandom={question?.ordineCasuale}/>
                    </RadioGroup>
                </Box>
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

        </Box>
    );

}

export default TestExecutor