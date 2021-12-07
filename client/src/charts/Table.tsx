import { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

type rowProp = {
    id: number,
    response_description: string,
    response: [number, number]
}

type tableProp = {
    data: {[key: string]: [number, number]}
}

function Table (props : tableProp) {
    const data = props.data;
    console.log("table data received: ", data)
    const [entries, setEntries] = useState<Array<rowProp>>([]);
    const columns: TableColumn<rowProp>[] = [
        {
            name: "Ethnicity",
            selector: row => row.response_description
        },
        {
            name: "Percentage",
            selector: row => row.response.toString()
        }
    ];
    useEffect(() => {
        let count: number = 0
        for (const [key, value] of Object.entries(data)) {
            let d: rowProp;
            d = {
            id: count,
            response_description: key,
            response: value
            };
            count++;
            setEntries(entries => [...entries, d]);
        }
        console.log("entries: ", entries)
    
    }, []);
    return ( 
        <DataTable title="Ethnicity of Respondents" columns= {columns} data={entries}
      /> 
    )
    
}

export default Table;