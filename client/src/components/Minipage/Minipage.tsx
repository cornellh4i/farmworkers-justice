import "@fontsource/rubik";
import './Minipage.scss';
import Dropdown from "../Dropdown/Dropdown";
import "@fontsource/rubik";
import Button from '@mui/material/Button';
import { getVariablesByCategory } from "./../Homepage/Homepage"
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FilterPanel from "../FilterPanel/FilterPanel";
import domtoimage from "dom-to-image";

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

    async function handleDownload(event: any) {
        event.preventDefault();

        var node = document.getElementById("all")!;
        domtoimage.toJpeg(node)
            .then(function (dataUrl: any) {
                var link = document.createElement('a');
                link.download = "test.jpeg";
                link.href = dataUrl;
                link.click();
            })
            .catch(function (error: Error) {
                console.error("Something went wrong!", error);
            })
    }

    return (
        <div>
            <div id="download">
                <Button variant="contained" onClick={handleDownload}>Download All</Button>
            </div>
            <FilterPanel mapFilterSelected={mapFilterSelected} setMapFilterSelected={setMapFilterSelected} filter1Selected={filter1Selected} setFilter1Selected={setFilter1Selected} filter2Selected={filter2Selected} setFilter2Selected={setFilter2Selected} />
            <div id="all">
                <ul>
                    {variableDescriptions.map((variableDescription, index) =>
                        <Dropdown key={index.toString()} variableDescription={variableDescription} index={index}
                            variable={variableEncodings[index]} mapFilterSelected={mapFilterSelected} filter1Selected={filter1Selected} filter2Selected={filter2Selected}
                            currentCollapseIndex={currentCollapseIndex} setCurrentCollapseIndex={setCurrentCollapseIndex}></Dropdown>)}
                </ul>
            </div>

        </div>
    )
}
export default Minipage;