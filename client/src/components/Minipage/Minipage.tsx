import "@fontsource/rubik";
import './Minipage.scss';
import Dropdown from "../Dropdown/Dropdown";
import "@fontsource/rubik";
import { getVariablesByCategory } from "./../Homepage/Homepage"
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FilterPanel from "../FilterPanel/FilterPanel";
import Grid from "@mui/material/Grid"
import Map from './../../charts/Map';


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
        <Grid container>
            <Grid className="filterPanel" item xs={9}>
                <div className="filterPanel">
                    <FilterPanel mapFilterSelected={mapFilterSelected} setMapFilterSelected={setMapFilterSelected} filter1Selected={filter1Selected} setFilter1Selected={setFilter1Selected} filter2Selected={filter2Selected} setFilter2Selected={setFilter2Selected} />
                </div>
                <div className="dropDowns">
                    <ul>
                        {variableDescriptions.map((variableDescription, index) => 
                            <Dropdown key={index.toString()} variableDescription={variableDescription} index={index} 
                            variable={variableEncodings[index]} filter1Selected={filter1Selected} filter2Selected={filter2Selected}
                            currentCollapseIndex={currentCollapseIndex} setCurrentCollapseIndex={setCurrentCollapseIndex}></Dropdown>)}
                    </ul>
                </div>
            </Grid>
            <Grid item xs={3}>
                {mapFilterSelected === null ? null : <Map mapFilterSelected={mapFilterSelected} />}
            </Grid>
        </Grid>
    )
}
export default Minipage;