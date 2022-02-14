import { useEffect } from "react";
import Button from '@mui/material/Button';
import * as categories from "../local-json/categories.json"
import { isConstructorDeclaration } from "typescript";




interface CategoryCardProp {
    categoryTitle: string
    categoryVariables: string[]
}


function CategoryCard(props: CategoryCardProp) {
    var variables: string[] = [];
    //useEffect(() => {
    // only when change occurs to page
    for (let i = 0; i < props.categoryVariables.length; i++) {
        //console.log(props.categoryVariables["variable-description"])
        variables.push(props.categoryVariables[i])
    }
    console.log(variables)
    //})
    return (
        <div>
            <h2>{props.categoryTitle}</h2>
            <Button variant="contained"> View Visualizations
            </Button>
            <ol>
                {variables.map((variable) => <li>{variable}</li>)}
            </ol>
        </div>
    )
}

export default CategoryCard;