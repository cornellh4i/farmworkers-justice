import { useState } from "react";
import Button from '@mui/material/Button';
import "@fontsource/rubik";
import './CategoryCard.scss';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

interface CategoryCardProp {
    categoryTitle: string,
    categoryEncoding: number,
    image: string
}

const variablesInCategories = require('./../../local-json/categories.json')

/**
 * @param categoryIndex 0-based order of category appearing on the homepage
 * @returns an array of descriptions corresponding to all variables under   
 *          the input category
 */
function getVariablesByCategory(categoryIndex: number) {
    var variables = variablesInCategories["categories"][categoryIndex]["variables"]
    var descriptionsByCategory = []
    for (let i = 0; i < variables.length; i++) {
        descriptionsByCategory.push(variables[i]["variable-description"])
    }
    return descriptionsByCategory
}


function CategoryCard(props: CategoryCardProp) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    var categoryVariables = getVariablesByCategory(props.categoryEncoding)


    function viewVisualizationOnClick() {
        navigate(`/visualizations/${props.categoryEncoding}`)
    }

    return (
        <div>
            <div className="categoryCardContainer">
                <h2 className="categoryHeader">{props.categoryTitle}</h2>
                <Grid container >
                    <Grid item xs={1}>
                        <hr className="orangeLine" />
                    </Grid>
                    <Grid item xs={11}>
                        <hr className="greyLine" />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <img className="cardImageStyle" src={props.image} alt="cardcomponentimage" ></img>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#FFA500', width: '100%' }}
                            className="view-visualizations"
                            onClick={viewVisualizationOnClick}
                        >
                            View Visualizations
                        </Button>
                    </Grid>
                    <Grid item xs={9}>
                        <h3 className="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pulvinar dui at fermentum pulvinar. Convallis sed orci nullam enim penatibus lobortis. Euismod morbi condimentum nec est enim ut feugiat volutpat. Massa euismod et elit ultricies congue sit dui. </h3>
                        <ListItemButton onClick={() => { setOpen(!open) }}>
                            <h4 className="variables-list-collapse"> What NAWS questions are covered in this category? </h4>
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <div className="variables-list" >
                                {categoryVariables.map((categoryVariable, index) => <li key={index}>{categoryVariable}</li>)}
                            </div>
                        </Collapse>
                    </Grid>
                </Grid>
            </div >
        </div >
    )
}

export default CategoryCard;