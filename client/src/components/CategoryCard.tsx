import { useEffect } from "react";
import Button from '@mui/material/Button';
import * as categories from "../local-json/categories.json"
import { isConstructorDeclaration } from "typescript";




interface CategoryCardProp {
    categoryTitle: string
    categoryVariables: any;
}
let variables: string[] = [];


function CategoryCard(props: CategoryCardProp) {
    useEffect(() => {
        for (props.categoryVariables.variable_description in props.categoryVariables) {
            console.log(props.categoryVariables.variable_description)
            variables.push(props.categoryVariables.variable_description)
        }
    })


    return (
        <div>
            <h2>{props.categoryTitle}</h2>
            <Button variant="contained"> View Visualizations
            </Button>
            <h3>
                {variables}
            </h3>

        </div>



    )
}

export default CategoryCard;