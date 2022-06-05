import CategoryCard from "../CategoryCard/CategoryCard";
import headerImage from "./../../images/headerImage.jpg";
import fjLogo from "./../../images/FJlogo.jpg"
import h4iLogo from "./../../images/h4i-logo.png"
import category0Image from "./../../images/category0.jpg";
import category1Image from "./../../images/category1.jpg";
import category2Image from "./../../images/category2.jpg";
import category3Image from "./../../images/category3.jpg";
import category4Image from "./../../images/category4.jpg";
import category5Image from "./../../images/category5.jpg";
import category7Image from "./../../images/category7.jpg";
import category8Image from "./../../images/category8.jpg";
import "@fontsource/rubik";
import './Homepage.scss';
import Divider from '@mui/material/Divider';

const variablesInCategories = require('./../../local-json/categories.json')

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

/**
 * The category with encoding 6 is not displayed because there are no variables under the category. 
 */
function Homepage() {
  return (
    <div>
      <div className="headerContainer">
        <img src={headerImage} alt="Workers in a field" className="imageStyle"></img>
        <img src={fjLogo} alt="Farmworker Justice logo" className="fj-logo"></img>
        <div className="header">
          <h2 className="title-top">Visualization of Data from the</h2>
          <h1 className="title-bottom">National Agricultural Workers Survey (NAWS)</h1>
          <div id="rectangle"></div>
        </div>
      </div>
      <div className="introduction-text">
        <h3>What is the National Agricultural Workers Survey (NAWS)?</h3>
        <h4>The U.S. Department of Labor's National Agricultural Workers Survey (NAWS) is an employment-based, random-sample survey of U.S. crop workers that collects demographic, employment, and health data in face-to-face interviews. The primary purposes of the NAWS are to monitor the terms and conditions of agricultural employment and assess the conditions of farmworkers. The survey also generates information for various Federal agencies that oversee farmworker programs. The survey began in 1989 and since then, more than 68,000 workers have been interviewed.  The NAWS data is released in two year increments, and the most recent data is from the 2017-18 survey period.</h4>
        <h3>Who is surveyed?</h3>
        <h4>The NAWS surveys hired workers (those workers who are not owners of the farm) employed in crop and crop-related work at the time of interview. To be interviewed, workers must be hired by an eligible establishment and working at an eligible task. Eligible establishments are those classified in the North American Industrial Classification System (NAICS) as Crop Production (NAICS code 111) or as Support Activities for Crop Production (NAICS code 1151). Crop Production comprises establishments such as farms, orchards, groves, greenhouses, and nurseries primarily engaged in growing crops, plants, vines, or trees and their seeds. Support Activities includes establishments primarily engaged in providing support activities for growing crops. Examples of support activities include supplying labor, aerial dusting or spraying, cotton ginning, cultivating services, farm management services, planting crops, and vineyard cultivation services.  
The NAWS does not include data from workers on H-2A temporary agricultural work visas.</h4>
        <h3>What data visualizations are presented on this site?</h3>
        <h4>The data visualizations presented on this site are a collection of some of the most significant NAWS questions identified by Farmworker Justice. In most cases, they are limited to the most recent two-year cycle of data.  To access additional questions and the raw data that forms the basis of these visualizations, you can visit <a href='https://www.dol.gov/agencies/eta/national-agricultural-workers-survey/data'>here</a>.</h4>
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
      <CategoryCard categoryTitle="Income, Assets, and Use of Assistance Programs"
        categoryEncoding={7} image={category7Image} />
      <CategoryCard categoryTitle="Health Care in the United States"
        categoryEncoding={8} image={category8Image} />
      <Divider sx={{padding: '2rem'}}/>
      <div className="contribution">
        <img src={h4iLogo} alt="Hack4Impact logo" className="h4i-logo"></img>
        <p>Website contributed by Cornell Hack4Impact</p>
      </div>
    </div>
  )

}
export default Homepage;