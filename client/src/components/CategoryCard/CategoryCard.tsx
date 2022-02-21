import { useState } from "react";
import Button from '@mui/material/Button';
import "@fontsource/rubik";
import './CategoryCard.scss';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface CategoryCardProp {
    categoryTitle: string
    categoryVariables: string[]
    image: string
}


function CategoryCard(props: CategoryCardProp) {
    var variables: string[] = [];
    const [open, setOpen] = useState(false);


    for (let i = 0; i < props.categoryVariables.length; i++) {
        variables.push(props.categoryVariables[i])
    }

    return (
        <div>
            <link rel="stylesheet" href="../styles.scss"></link>
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
                            sx={{backgroundColor: '#FFA500', width: '100%'}}
                            className="view-visualizations"> View Visualizations
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
                                {variables.map((variable) => <li>{variable}</li>)}
                            </div>
                        </Collapse>

                    </Grid>
                </Grid>
                
            </div >
        </div >
    )
}

export default CategoryCard;