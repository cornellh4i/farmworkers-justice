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
    const [currentCollapseIndex, setCurrentCollapseIndex] = useState<number | null>(null)
    const [variableEncodings, setVariableEncodings] = useState<Array<string>>([])
    const [mapFilterSelected, setMapFilterSelected] = useState<null | string>(null);
    const [filter1Selected, setFilter1Selected] = useState<null | string[]>(null);
    const [filter2Selected, setFilter2Selected] = useState<null | string[]>(null);
    const [variableDescriptions, setVariableDescriptions] = useState<string[]>([]);


    useEffect(() => {

        function getVariablesEncoding(categoryIndex: number) {
            var variables = variablesInCategories["categories"][categoryIndex]["variables"]
            var allvariableEncodings: string[] = []
            for (let i = 0; i < variables.length; i++) {
                allvariableEncodings.push(variables[i]["variable-encoding"])
            }
            setVariableEncodings(allvariableEncodings)
        }

        getVariablesEncoding(categoryIndex)
        var descriptions = getVariablesByCategory(categoryIndex)
        setVariableDescriptions(descriptions)
    }, [])


    return (
        <div>
            <FilterPanel setMapFilterSelected={setMapFilterSelected} setFilter1Selected={setFilter1Selected} setFilter2Selected={setFilter2Selected} />
            {variableDescriptions.map((variableDescription, index) => <Dropdown key={index.toString()} variableDescription={variableDescription}
                index={index} variable={variableEncodings[index]} mapFilterSelected={mapFilterSelected} filter1Selected={filter1Selected} filter2Selected={filter2Selected}
                currentCollapseIndex={currentCollapseIndex} setCurrentCollapseIndex={setCurrentCollapseIndex}></Dropdown>)}
        </div>
    )
}
export default Minipage;