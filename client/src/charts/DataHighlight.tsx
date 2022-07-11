import './DataHighlight.scss'

const LATEST_ODD_YEAR = process.env.REACT_APP_LATEST_ODD_YEAR;
const LATEST_EVEN_YEAR = process.env.REACT_APP_LATEST_EVEN_YEAR;
const API_URL = process.env.REACT_APP_API;

console.log("LATEST_EVEN_YEAR ", LATEST_EVEN_YEAR)
console.log("API_URL: ", API_URL)


interface DataHighlightDataProps {
    percentage: number,
    description: string
}

interface DataHighlightProps {
    data: DataHighlightDataProps
}

function DataHighlight (props: DataHighlightProps) {
    return (
        <div className='data-highlight-container'> 
            <span className='percentage'>{props.data.percentage}% </span> 
            <span>answered {props.data.description} in {LATEST_ODD_YEAR} - {LATEST_EVEN_YEAR}</span>
        </div>
    )
}

export default DataHighlight;
