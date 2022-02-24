import "@fontsource/rubik";
import './Minipage.scss';
import Dropdown from "../Dropdown/Dropdown";
import "@fontsource/rubik";
import { getVariablesByCategory } from "./../Homepage/Homepage"
function Minipage() {
    const variablesInCategories = require('./../../local-json/categories.json')
    return (
        <div>
            {getVariablesByCategory(0).map((variable) => <Dropdown categoryVariable={variable} categoryIndex={0}></Dropdown>)}
            {getVariablesByCategory(1).map((variable) => <Dropdown categoryVariable={variable} categoryIndex={1}></Dropdown>)}
            {getVariablesByCategory(2).map((variable) => <Dropdown categoryVariable={variable} categoryIndex={2}></Dropdown>)}
            {getVariablesByCategory(3).map((variable) => <Dropdown categoryVariable={variable} categoryIndex={3}></Dropdown>)}
            {getVariablesByCategory(4).map((variable) => <Dropdown categoryVariable={variable} categoryIndex={4}></Dropdown>)}
            {getVariablesByCategory(5).map((variable) => <Dropdown categoryVariable={variable} categoryIndex={5}></Dropdown>)}
            {getVariablesByCategory(6).map((variable) => <Dropdown categoryVariable={variable} categoryIndex={6}></Dropdown>)}
            {getVariablesByCategory(7).map((variable) => <Dropdown categoryVariable={variable} categoryIndex={7}></Dropdown>)}
            {getVariablesByCategory(8).map((variable) => <Dropdown categoryVariable={variable} categoryIndex={8}></Dropdown>)}
        </div>
    )
}
export default Minipage;