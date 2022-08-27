import arrayShuffle from 'array-shuffle';
import {Checkbox, FormControlLabel} from "@mui/material";

function Responses(props) {
    let data = props.data.risposte;
    function handleChange(e) {
        let isChecked = e.target.checked;
        console.log(e.target.name);
        // do whatever you want with isChecked value
    }

    const risposte = data?.map((data) =>
        <FormControlLabel control={<Checkbox />}
                          label={data.testo}
                          name={data.id}
                          onChange={e => handleChange(e)}/>
    );

    return (
        <div>{risposte}</div>
    );

}

export default Responses