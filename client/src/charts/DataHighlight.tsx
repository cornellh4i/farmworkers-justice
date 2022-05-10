import './DataHighlight.scss'
import { LATEST_ODD_YEAR, LATEST_EVEN_YEAR } from './../App'

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
