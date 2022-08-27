import arrayShuffle from 'array-shuffle';
import {Checkbox, FormControlLabel} from "@mui/material";

function Responses(props) {
    let state = props.state;
    let data = props.data.risposte;
    let numero = 0;
    function handleChange(e) {
        let isChecked = e.target.checked;

        state[e.target.name] = e.target.checked;
    }

    const renderCheckBox = (isActive) => {
        if(isActive){
            return(<Checkbox defaultChecked/>)
        }
        return(<Checkbox />)
    }
    const renderNumero = () => {
        if(props.data.risposteConNumero){
            numero = numero + 1;
            return(<b>{numero}. </b>)
        }
        return(<div></div>)
    }

    const risposte = data?.map((data) =>
        <div key={data.id}>{renderNumero()}<FormControlLabel control={renderCheckBox(state[data.id])}
                          label={data.testo}
                          name={data.id}
                          onChange={e => handleChange(e)}/>
        </div>
    );

    return (
        <div>{risposte}</div>
    );

}

export default Responses