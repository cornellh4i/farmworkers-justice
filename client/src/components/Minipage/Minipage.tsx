import "@fontsource/rubik";
import './Minipage.scss';
import Dropdown from "../Dropdown/Dropdown";
import "@fontsource/rubik";
import { getVariablesByCategory } from "./../Homepage/Homepage"
import { useParams } from 'react-router-dom';


function Minipage() {
    const params = useParams();
    const categoryIndex = parseInt(params.categoryEncoding!)
    return (
        <div>
            {getVariablesByCategory(categoryIndex).map((variable) => <Dropdown categoryVariable={variable} categoryIndex={0}></Dropdown>)}
        </div>
    )
}
export default Minipage;