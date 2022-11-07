import './DataHighlight.scss'

const API_URL = process.env.REACT_APP_API;

interface DataHighlightDataProps {
    percentage: number
    description: string
}

interface DataHighlightProps {
    data: DataHighlightDataProps
    LATEST_ODD_YEAR: string
    LATEST_EVEN_YEAR: string
}

function DataHighlight (props: DataHighlightProps) {
    console.log(props.LATEST_ODD_YEAR)
    return (
        <div className='data-highlight-container'> 
            <span className='percentage'>{props.data.percentage}% </span> 
            <span>answered {props.data.description} in {props.LATEST_ODD_YEAR} - {props.LATEST_EVEN_YEAR}</span>
        </div>
    )
}

export default DataHighlight;
