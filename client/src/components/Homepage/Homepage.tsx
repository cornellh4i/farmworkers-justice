import CategoryCard from "../CategoryCard/CategoryCard";
import headerImage from "./../../images/headerImage.jpg";
import category0Image from "./../../images/category0.jpg";
import category1Image from "./../../images/category1.jpg";
import category2Image from "./../../images/category2.jpg";
import category3Image from "./../../images/category3.jpg";
import category4Image from "./../../images/category4.jpg";
import category5Image from "./../../images/category5.jpg";
import category6Image from "./../../images/category6.jpg";
import category7Image from "./../../images/category7.jpg";
import category8Image from "./../../images/category8.jpg";
import "@fontsource/rubik";
import './Homepage.scss';
import variablesInCategories from './../../local-json/categories.json';

/**
  * @param categoryIndex 0-based order of category appearing on the homepage
  * @returns an array of descriptions corresponding to all variables under   
  *          the input category
  */
export function getVariablesByCategory(categoryIndex: number) {
  var variables = variablesInCategories["categories"][categoryIndex]["variables"]
  var descriptionsByCategory = []
  for (let i = 0; i < variables.length; i++) {
    descriptionsByCategory.push(variables[i]["variable-description"])
  }
  return descriptionsByCategory

}

function Homepage() {
  return (
    <div>
      <div className="headerContainer">
        <img src={headerImage} alt="Workers in a field" className="imageStyle"></img>
        <div className="header">
          <h1 className="h1-top">Visualization of Data from the</h1>
          <h1 className="h1-bottom">National Agricultural Workers Survey (NAWS)</h1>
          <div id="rectangle"></div>
        </div>
      </div>
      <div className="introduction-text">
        <h3>What is the National Agricultural Workers Survey (NAWS)?</h3>
        <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pulvinar dui at fermentum pulvinar. Convallis sed orci nullam enim penatibus lobortis. Euismod morbi condimentum nec est enim ut feugiat volutpat. Massa euismod et elit ultricies congue sit dui. </h4>
        <h3>Who is surveyed?</h3>
        <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pulvinar dui at fermentum pulvinar. Convallis sed orci nullam enim penatibus lobortis. Euismod morbi condimentum nec est enim ut feugiat volutpat. Massa euismod et elit ultricies congue sit dui. </h4>
        <h3>What data visualizations are presented on this site?</h3>
        <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pulvinar dui at fermentum pulvinar. Convallis sed orci nullam enim penatibus lobortis. Euismod morbi condimentum nec est enim ut feugiat volutpat. Massa euismod et elit ultricies congue sit dui. </h4>
      </div>
      <CategoryCard categoryTitle="Birthplace, Work Authorization, and Migrant Types"
        categoryEncoding={0} image={category0Image} />
      <CategoryCard categoryTitle="Demographics, Family Size, Children, and Household Structure"
        categoryEncoding={1} image={category1Image} />
      <CategoryCard categoryTitle="Language, Education, and English Skills"
        categoryEncoding={2} image={category2Image} />
      <CategoryCard categoryTitle="Housing Characteristics and Distance to Work"
        categoryEncoding={3} image={category3Image} />
      <CategoryCard categoryTitle="Employment Patterns and Farm Job Characteristics"
        categoryEncoding={4} image={category4Image} />
      <CategoryCard categoryTitle="Employment Experience"
        categoryEncoding={5} image={category5Image} />
      <CategoryCard categoryTitle="Non-Crop Work Activities During the Year"
        categoryEncoding={6} image={category6Image} />
      <CategoryCard categoryTitle="Income, Assets, and Use of Assistance Programs"
        categoryEncoding={7} image={category7Image} />
      <CategoryCard categoryTitle="Health Care in the United States"
        categoryEncoding={8} image={category8Image} />
    </div>
  )

}
export default Homepage;