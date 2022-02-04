import { useEffect } from "react";

interface CategoryCardProp{
    categoryTitle: string
}

function CategoryCard(props: CategoryCardProp) {
    let variables;
    useEffect(() => {
        //TODO: FETCH FROM JSON FILE
        //variables = 
    })

    return (
        <div>
            <h2>{props.categoryTitle}</h2>
        </div>
    )
}

export default CategoryCard;