import CategoryCard from "./CategoryCard";

function Homepage() {
  const variablesInCategories = require('../local-json/categories.json')


  return (
    <div>
      <h2>Visualization of Data from the</h2>
      <h1>National Agricultural Workers Survey (NAWS)</h1>
      <CategoryCard categoryTitle="Birthplace, Work Authorization, and Migrant Types"
        categoryVariables={getVariablesByCategory(1)} />

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