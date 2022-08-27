import {useParams} from "react-router-dom";
import {gql, useMutation, useQuery} from "@apollo/client";
import {useState} from "react";
import Responses from "./Responses";
import {FormGroup} from "@mui/material";

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


function TestExecutor() {
    const {data} = useParams()
    const {nome} = useParams()
    const [name, setName] = useState("No Name")
    const [questionNumber, setQuestionNumber] = useState(0)
    const [questions, setQuestions] = useState([])
    const [question, setQuestion] = useState({})
    const [testState, setTestState] = useState({})
    const [id, setID] = useState(0)
    const [completeData, setCompleteData] = useState({})

    const [mutateFunction, { error_mutation, loading_mutation, data_mutation }] = useMutation(START_TEST, {
        variables: {data, nome},
        onCompleted(data_mutation) {
            setID(data_mutation.iniziaTest.id);
        }
    });

    const {loading, error, data_graphql} = useQuery(GET_TEST_DATA, {
        variables: {data, nome},
        onCompleted(data_graphql) {

            setName(data_graphql.testByID.nome);
            setQuestions(data_graphql.testByID.domande);
            setQuestion(data_graphql.testByID.domande[0]);
            setCompleteData(data_graphql.testByID);

            data_graphql.testByID.domande.forEach((question, index) => {
                question.risposte.forEach((risposta, index) => {
                    testState[risposta.id] = false;
                });
            });

            mutateFunction().then(r => {});

        }
    });

    function handleSubmit(e) {
        e.preventDefault();
        console.log(questionNumber);
        setQuestionNumber(questionNumber + 1 % questions.length);
        setQuestion(questions[questionNumber + 1 % questions.length]);
    }

    const renderNumeroDomanda = () => {
        if(completeData.domandeConNumero){
            return(<b>{questionNumber+1}. </b>)
        }
        return(<div></div>)
    }

    return (
        <div>
            <h1>{name}</h1>
            <h3>{renderNumeroDomanda()}{question.testo}</h3>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Responses data={question} state={testState}/>
                </FormGroup>

                <button type="submit">Submit</button>
            </form>


        </div>
    );

}

export default TestExecutor