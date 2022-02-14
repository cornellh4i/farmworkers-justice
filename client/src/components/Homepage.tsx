import CategoryCard from "./CategoryCard";

function Homepage() {
  const variablesInCategories = require('../local-json/categories.json')


  return (
    <div>
      <img src="./Hero1.png" style={{width:"1920px",height:"563px",position:"absolute",left:"-287px"}}></img>
      <h2>Visualization of Data from the</h2>
      <h1>National Agricultural Workers Survey (NAWS)</h1>
      <h3>What is the National Agricultural Workers Survey (NAWS)?</h3>
      <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pulvinar dui at fermentum pulvinar. Convallis sed orci nullam enim penatibus lobortis. Euismod morbi condimentum nec est enim ut feugiat volutpat. Massa euismod et elit ultricies congue sit dui. </h4>
      <h3>Who is surveyed?</h3>
      <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pulvinar dui at fermentum pulvinar. Convallis sed orci nullam enim penatibus lobortis. Euismod morbi condimentum nec est enim ut feugiat volutpat. Massa euismod et elit ultricies congue sit dui. </h4>
      <h3>What data visualizations are presented on this site?</h3>
      <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pulvinar dui at fermentum pulvinar. Convallis sed orci nullam enim penatibus lobortis. Euismod morbi condimentum nec est enim ut feugiat volutpat. Massa euismod et elit ultricies congue sit dui. </h4>
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