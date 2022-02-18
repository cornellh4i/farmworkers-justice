import { useEffect } from "react";
import Button from '@mui/material/Button';
import * as categories from "../local-json/categories.json"
import { isConstructorDeclaration } from "typescript";
import image from "../images/CardImage.png";
import "@fontsource/rubik";
import '../styles.scss';




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

            <link rel="stylesheet" href="../styles.scss"></link>
            <div className="headerContainer">
                <h2 className="categoryHeader">{props.categoryTitle}</h2>
                <img className="cardImageStyle" src={image} alt="cardcomponentimage" ></img>


                <h3 className="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pulvinar dui at fermentum pulvinar. Convallis sed orci nullam enim penatibus lobortis. Euismod morbi condimentum nec est enim ut feugiat volutpat. Massa euismod et elit ultricies congue sit dui. </h3>
                <h4 className="embeddedLink"> What NAWS questions are covered in this category? </h4>
                <ol className="body2" >
                    {variables.map((variable) => <li>{variable}</li>)}
                </ol>
                <Button className="primarybutton"> View Visualizations
                </Button>
            </div>
        </div>
    )
}

export default CategoryCard;