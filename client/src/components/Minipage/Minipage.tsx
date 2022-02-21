import "@fontsource/rubik";
import './Minipage.scss';
import Dropdown from "../Dropdown/Dropdown";
import "@fontsource/rubik";
import { getVariablesByCategory } from "./../Homepage/Homepage"

function Minipage() {
    const variablesInCategories = require('./../../local-json/categories.json')
    return (
        <div>
        <Dropdown categoryIndex={0} categoryVariables={getVariablesByCategory(0)} />
        <Dropdown categoryIndex={1} categoryVariables={getVariablesByCategory(1)} />
        <Dropdown categoryIndex={2} categoryVariables={getVariablesByCategory(2)} />
        <Dropdown categoryIndex={3} categoryVariables={getVariablesByCategory(3)} />
        <Dropdown categoryIndex={4} categoryVariables={getVariablesByCategory(4)} />
        <Dropdown categoryIndex={5} categoryVariables={getVariablesByCategory(5)} />
        <Dropdown categoryIndex={6} categoryVariables={getVariablesByCategory(6)} />
        <Dropdown categoryIndex={7} categoryVariables={getVariablesByCategory(7)} />
        <Dropdown categoryIndex={8} categoryVariables={getVariablesByCategory(8)} />
        <Dropdown categoryIndex={9} categoryVariables={getVariablesByCategory(9)} />
        </div>
    )




}
export default Minipage;