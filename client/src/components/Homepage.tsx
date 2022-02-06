function Homepage () {
    const variablesInCategories = require('../local-json/categories.json')

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

    return (
        <div></div>
    )
}

export default Homepage;