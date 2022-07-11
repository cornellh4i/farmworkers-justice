import DataTable, { TableColumn } from 'react-data-table-component';

type rowProp = {
    id: number,
    response_description: string,
    response: number
}

type tableProp = {
    data: { [key: string]: number },
    variableDescription: string
}

function Table(props: tableProp) {
    let entries: rowProp[] = [];
    const columns: TableColumn<rowProp>[] = [
        {
            name: props.variableDescription,
            selector: row => row.response_description
        },
        {
            name: "Percentage",
            selector: row => row.response + "%"
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

    return (
        <DataTable columns={columns} data={entries}
        />
    )
}

export default Table;