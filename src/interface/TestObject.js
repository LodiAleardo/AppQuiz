import {Link} from "react-router-dom";

function TestObject(props){
    const { data, close } = props


    var listItems = data.map((data) =>
        <li key={data.nome}>{data.nome} and name {data.data} - <Link to={`/do_test/${data.data}/${data.nome}`}> To the test </Link></li>
    );

    if(data.length === 0){
        listItems = (<li key="NoTest">Non hai test da compilare</li>)
    }

    return (
        <ul>{listItems}</ul>
    );

}

export default TestObject