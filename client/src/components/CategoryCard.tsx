import Button from '@mui/material/Button';
import image from "../images/CardImage.png";
import "@fontsource/rubik";
import '../styles.scss';
import Grid from '@mui/material/Grid';




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
                        <img className="cardImageStyle" src={image} alt="cardcomponentimage" ></img>
                        <Button
                            variant="contained"
                            sx={{backgroundColor: '#FFA500', width: '100%'}}
                            className="view-visualizations"> View Visualizations
                        </Button>
                    </Grid>
                    <Grid item xs={9}>
                        <h3 className="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pulvinar dui at fermentum pulvinar. Convallis sed orci nullam enim penatibus lobortis. Euismod morbi condimentum nec est enim ut feugiat volutpat. Massa euismod et elit ultricies congue sit dui. </h3>
                        <h4 className="embeddedLink"> What NAWS questions are covered in this category? </h4>
                        <div className="variable-list" >
                            {variables.map((variable) => <li>{variable}</li>)}
                        </div>
                    </Grid>
                </Grid>
                
            </div >
        </div >
    )
}

export default CategoryCard;