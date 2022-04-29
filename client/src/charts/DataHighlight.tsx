import './DataHighlight.scss'

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
            <span>answered {props.data.description}</span>
        </div>
    )
}

export default DataHighlight;
