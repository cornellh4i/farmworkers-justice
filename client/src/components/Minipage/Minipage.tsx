import "@fontsource/rubik";
import './Minipage.scss';
import Dropdown from "../Dropdown/Dropdown";
import "@fontsource/rubik";
import { getVariablesByCategory } from "./../Homepage/Homepage"

function Minipage() {
    const variablesInCategories = require('./../../local-json/categories.json')
    // function getVariables(categoryIndex: number) {
    //     //var variables = []
    //     var categories = variablesInCategories["categories"]
    //     // for (let i = 0; i < categories.length; i++) {
    //     //     var singlecategory = categories[i]
    //     //     for (let j = 0; j < singlecategory.length; j++) {
    //     //         variables.push(variablesInCategories["categories"][i][j])
    //     //     }
    //     // }
    //     //console.log(variables)
    //     return variables
    // }

    const v = getVariablesByCategory(0)
    return (
        <div>
            {v.map((variable) => <Dropdown variableName={variable}></Dropdown>)}
        </div>
    )




}
export default Minipage;