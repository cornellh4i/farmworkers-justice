import "@fontsource/rubik";
import './Minipage.scss';
import Dropdown from "../Dropdown/Dropdown";
import "@fontsource/rubik";
import { getVariablesByCategory } from "./../Homepage/Homepage"
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FilterPanel from "../FilterPanel/FilterPanel";

function Minipage() {
    const params = useParams();
    const categoryIndex = parseInt(params.categoryEncoding!)

    const variablesInCategories = require('./../../local-json/categories.json')

    const [dropdownIndex, setDropdownIndex] = useState<number | null>(null)
    const [encodings, setEncodings] = useState<Array<string>>([])

    const [mapFilterSelected, setMapFilterSelected] = useState<null | string>(null);



    function onCollapse(index: number) {
        if (index === dropdownIndex) {
            setDropdownIndex(null) // closing collapse
        } else {
            setDropdownIndex(index);
        }
    }

    function getVariablesEncoding(categoryIndex: number) {
        var variables = variablesInCategories["categories"][categoryIndex]["variables"]
        var allEncodings: string[] = []
        for (let i = 0; i < variables.length; i++) {
            allEncodings.push(variables[i]["variable-encoding"])
        }
        setEncodings(allEncodings) 
    }

    useEffect(() => {
        getVariablesEncoding(categoryIndex)
    }, [categoryIndex])
    

    return (
        <div>
            <FilterPanel setMapFilterSelected={setMapFilterSelected}/>
            {getVariablesByCategory(categoryIndex).map((variable, index) => <Dropdown key={index} categoryVariable={variable} 
                dropdownOpen={index === dropdownIndex} dropdownIndex={index} encoding={encodings[index]} onCollapse={onCollapse} 
                mapFilterSelected={mapFilterSelected}


                ></Dropdown>)}
        </div>
    )
}
export default Minipage;