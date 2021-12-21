import DataTable, { TableColumn } from 'react-data-table-component';

type rowProp = {
    id: number,
    response_description: string,
    response: [number, number]
}

type tableProp = {
    data: {[key: string]: [number, number]}
}

const PECENTAGE_INDEX = 0
const COUNT_INDEX = 1

function Table (props : tableProp) {
    console.log("table data received: ", props.data)
    let entries: rowProp[] = [];
    const columns: TableColumn<rowProp>[] = [
        {
            name: "Ethnicity",
            selector: row => row.response_description
        },
        {
            name: "Percentage",
            selector: row => row.response[PECENTAGE_INDEX] + "%" + " (" + row.response[COUNT_INDEX] + ")"
        }
    ];
    let count: number = 0
    for (const [key, value] of Object.entries(props.data)) {
        let d: rowProp;
        d = {
        id: count,
        response_description: key,
        response: value
        };
        count++;
        entries.push(d)
    }
    console.log("entries: ", entries)

    return ( 
        <DataTable title="Ethnicity of Respondents" columns= {columns} data={entries}
      /> 
    )
    
}

export default Table;