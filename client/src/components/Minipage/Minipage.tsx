import "@fontsource/rubik";
import './Minipage.scss';
import Dropdown from "../Dropdown/Dropdown";
import "@fontsource/rubik";
import { getVariablesByCategory } from "./../Homepage/Homepage"
import { useParams } from 'react-router-dom';
import { useState } from 'react';


function Minipage() {
    const params = useParams();
    const categoryIndex = parseInt(params.categoryEncoding!)

    const variablesInCategories = require('./../../local-json/categories.json')
    var encodings: string[] = []

    const [dropdownOpen, setDropdownOpen] = useState(0)
    // handle collapse function, pass function as prop to dropdown, 

    function onCollapse(index: number) {
        setDropdownOpen(index);

    }

    function getVariablesEncoding(categoryIndex: number) {
        var variables = variablesInCategories["categories"][categoryIndex]["variables"]
        //console.log("variables: ", variables)
        for (let i = 0; i < variables.length; i++) {
            encodings.push(variables[i]["variable-encoding"])
        }
        console.log(encodings)
        return encodings
    }
    getVariablesEncoding(categoryIndex)
    return (
        <div>
            {getVariablesByCategory(categoryIndex).map((variable, index) => <Dropdown categoryVariable={variable} dropdownOpen={index === dropdownOpen} dropdownIndex={index} categoryIndex={0} encodings={encodings[index]} onCollapse={onCollapse}></Dropdown>)}
        </div>
    )
}
export default Minipage;




// }
// function Minipage() {

//     const variablesInCategories = require('./../../local-json/categories.json')

//     return (
//         <div>
//             {getVariablesByCategory(0).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={0} variableEncoding={l[1]}></Dropdown>)}
//             {getVariablesByCategory(1).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={1} variableEncoding={l[1]}></Dropdown>)}
//             {getVariablesByCategory(2).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={2} variableEncoding={l[1]}></Dropdown>)}
//             {getVariablesByCategory(3).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={3} variableEncoding={l[1]}></Dropdown>)}
//             {getVariablesByCategory(4).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={4} variableEncoding={l[1]}></Dropdown>)}
//             {getVariablesByCategory(5).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={5} variableEncoding={l[1]}></Dropdown>)}
//             {getVariablesByCategory(6).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={6} variableEncoding={l[1]}></Dropdown>)}
//             {getVariablesByCategory(7).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={7} variableEncoding={l[1]}></Dropdown>)}
//             {getVariablesByCategory(8).map((l) => <Dropdown categoryVariable={l[0]} categoryIndex={8} variableEncoding={l[1]}></Dropdown>)}</div>)
