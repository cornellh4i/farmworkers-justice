import CategoryCard from "./CategoryCard";
import image from "./Hero1.jpg";
import "@fontsource/rubik";
import '../styles.scss';


const h1Style1 = {
  fontFamily:"Rubik", 
  fontStyle:"normal", 
  fontSize:"22px",
  // fontWeight: "bold" as "bold",
  width:"315px", 
  height:"20px", 
  // left:"100px", 
  // top:"289px",
  // color: "white"
  // position: "absolute",
  // bottom: "20px",
  // right: "20px",
  // backgroundColor: "black",
  // color: "white",
  // paddingLeft: "20px",
  // paddingRight: "20px"
}

const h1Style2 = {
  fontFamily:"Rubik", 
  fontStyle:"normal", 
  fontSize:"28px",
  // fontWeight: 900, 
  width:"315px", 
  height:"20px", 
  left:"100px", 
  // top:"253px",
  // color: "white"
}

const imageStyle = {
  width:"1920px",
  height:"563px",
  left:"-287px"
}

const h3Style= {
  // position:"static",
  width:"1111px",
  height:"20px",
  fontFamily:"Rubik",
  fontStyle:"normal",
  // fontWeight: 300,
  fontSize:"16px"
}

const h4Style= {
  // position:"static",
  width:"1111px",
  height:"44px",
  fontFamily:"Rubik",
  fontStyle:"normal",
  fontSize:"16px",
  top:"36px"
}


function Homepage() {
  const variablesInCategories = require('../local-json/categories.json')


  return (
    <div>
      <div className="headerContainer">
        <img src={image} alt ="test" style={imageStyle}></img>
        <div className="text">
          <h1 className="h1-top">Visualization of Data from the</h1>
          <h1 className="h1-bottom">National Agricultural Workers Survey (NAWS)</h1>
        </div>
      </div>
      <h3 style={h3Style}>What is the National Agricultural Workers Survey (NAWS)?</h3>
      <h4 style={h4Style}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pulvinar dui at fermentum pulvinar. Convallis sed orci nullam enim penatibus lobortis. Euismod morbi condimentum nec est enim ut feugiat volutpat. Massa euismod et elit ultricies congue sit dui. </h4>
      <h3 style={h3Style}>Who is surveyed?</h3>
      <h4 style={h4Style}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pulvinar dui at fermentum pulvinar. Convallis sed orci nullam enim penatibus lobortis. Euismod morbi condimentum nec est enim ut feugiat volutpat. Massa euismod et elit ultricies congue sit dui. </h4>
      <h3 style={h3Style}>What data visualizations are presented on this site?</h3>
      <h4 style={h4Style}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pulvinar dui at fermentum pulvinar. Convallis sed orci nullam enim penatibus lobortis. Euismod morbi condimentum nec est enim ut feugiat volutpat. Massa euismod et elit ultricies congue sit dui. </h4>
      <CategoryCard categoryTitle="Birthplace, Work Authorization, and Migrant Types"
        categoryVariables={getVariablesByCategory(0)} />
      <CategoryCard categoryTitle="Demographics, Family Size, Children, and Household Structure"
        categoryVariables={getVariablesByCategory(1)} />
      <CategoryCard categoryTitle="Language, Education, and English Skills"
        categoryVariables={getVariablesByCategory(2)} />
      <CategoryCard categoryTitle="Housing Characteristics and Distance to Work"
        categoryVariables={getVariablesByCategory(3)} />
      <CategoryCard categoryTitle="Employment Patterns and Farm Job Characteristics"
        categoryVariables={getVariablesByCategory(4)} />
      <CategoryCard categoryTitle="Employment Experience"
        categoryVariables={getVariablesByCategory(5)} />
      <CategoryCard categoryTitle="Non-Crop Work Activities During the Year"
        categoryVariables={getVariablesByCategory(6)} />
      <CategoryCard categoryTitle="Income, Assets, and Use of Assistance Programs"
        categoryVariables={getVariablesByCategory(7)} />
      <CategoryCard categoryTitle="Health Care in the United States"
        categoryVariables={getVariablesByCategory(8)} />
    

    </div>
  )

  /**
   * @param categoryIndex 0-based order of category appearing on the homepage
   * @returns an array of descriptions corresponding to all variables under   
   *          the input category
   */
  function getVariablesByCategory(categoryIndex: number) {
    var variables = variablesInCategories["categories"][categoryIndex]["variables"]
    console.log("variables: ", variables)
    var descriptionsByCategory = []
    for (let i = 0; i < variables.length; i++) {
      descriptionsByCategory.push(variables[i]["variable-description"])
    }
    return descriptionsByCategory

  }

}
export default Homepage;