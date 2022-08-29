import arrayShuffle from 'array-shuffle';
import {Checkbox, FormControlLabel, Radio} from "@mui/material";

function Responses(props) {
    let data = props.data.risposte;
    let isRandom = props.isRandom;
    let numero = 0;

    const renderNumero = () => {
        if (props.data.risposteConNumero) {
            numero = numero + 1;
            return (<b>{numero}. </b>)
        }
        return (<div></div>)
    }

    const risposte = data?.map((data) =>
        <div key={data.id}>{renderNumero()}<FormControlLabel control={<Radio/>}
                                                             label={data.testo}
                                                             name={data.id}
                                                             value={data.id}
        />{data.id}
        </div>
    );

    return (
        <div>{risposte}</div>
    );

}

export default Responses