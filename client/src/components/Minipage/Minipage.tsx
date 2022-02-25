import "@fontsource/rubik";
import './Minipage.scss';
import Dropdown from "../Dropdown/Dropdown";
import "@fontsource/rubik";
//import { getVariablesByCategory } from "./../Homepage/Homepage"


const variablesInCategories = require('./../../local-json/categories.json')

function getVariablesByCategory(categoryIndex: number) {
    var variables = variablesInCategories["categories"][categoryIndex]["variables"]
    console.log("variables: ", variables)
    var descriptionsByCategory: string[] = []
    var encodingByCategory: string[] = []
    for (let i = 0; i < variables.length; i++) {
        descriptionsByCategory.push(variables[i]["variable-description"])
        encodingByCategory.push(variables[i]["variable-encoding"])
    }
    console.log(descriptionsByCategory)
    return [descriptionsByCategory, encodingByCategory]

}
function Minipage() {

    const variablesInCategories = require('./../../local-json/categories.json')

    return (
        <div>
            {getVariablesByCategory(0).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={0} variableEncoding={l[1]}></Dropdown>)}
            {getVariablesByCategory(1).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={1} variableEncoding={l[1]}></Dropdown>)}
            {getVariablesByCategory(2).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={2} variableEncoding={l[1]}></Dropdown>)}
            {getVariablesByCategory(3).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={3} variableEncoding={l[1]}></Dropdown>)}
            {getVariablesByCategory(4).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={4} variableEncoding={l[1]}></Dropdown>)}
            {getVariablesByCategory(5).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={5} variableEncoding={l[1]}></Dropdown>)}
            {getVariablesByCategory(6).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={6} variableEncoding={l[1]}></Dropdown>)}
            {getVariablesByCategory(7).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={7} variableEncoding={l[1]}></Dropdown>)}
            {getVariablesByCategory(8).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={8} variableEncoding={l[1]}></Dropdown>)}
        </div>
    )
}
export default Minipage;