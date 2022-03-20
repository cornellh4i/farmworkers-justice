import './DataHighlight.scss'

interface DataHighlightProps {
    percentage: number,
    description: string
}

function DataHighlight (props: DataHighlightProps) {
    return (
        <div className='data-highlight-container'> 
            <span className='percentage'>{props.percentage}% </span> 
            <span>answered {props.description}</span>
        </div>
    )
}

 export default DataHighlight;
