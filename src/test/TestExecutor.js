import {useParams} from "react-router-dom";
import {gql, useQuery} from "@apollo/client";
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


function TestExecutor() {
    const {data} = useParams()
    const {nome} = useParams()
    const [name, setName] = useState("No Name")
    const [questionNumber, setQuestionNumber] = useState(0)
    const [questions, setQuestions] = useState([])
    const [question, setQuestion] = useState({})
    const [testData, setTestData] = useState()

    const {loading, error, data_graphql} = useQuery(GET_TEST_DATA, {
        variables: {data, nome},
        onCompleted(data_graphql) {
            console.log(data_graphql.testByID.domande);
            // setTestData(data_graphql.testByID);
            setName(data_graphql.testByID.nome);
            setQuestions(data_graphql.testByID.domande);
            setQuestion(data_graphql.testByID.domande[0]);
        }
    });

    function handleSubmit(e) {
        e.preventDefault();
        console.log(questionNumber);
        setQuestionNumber(questionNumber + 1 % questions.length);
        console.log(e.target.elements);
        setQuestion(questions[questionNumber + 1 % questions.length]);
    }

    return (
        <div>
            <h1>{name}</h1>
            <h3>{question.testo}</h3>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Responses data={question}/>
                </FormGroup>

                <button type="submit">Submit</button>
            </form>


        </div>
    );

}

export default TestExecutor