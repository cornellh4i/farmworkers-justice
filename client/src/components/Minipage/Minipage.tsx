import "@fontsource/rubik";
import './Minipage.scss';
import Dropdown from "./Dropdown";
import "@fontsource/rubik";

function Minipage() {
    const variablesInCategories = require('./../../local-json/categories.json')
    const v = getVariables()
    return (
        <div>
        {v.map((variable) => <Dropdown variableName={variable}></Dropdown>)}
        </div>
    )
  

    function getVariables(){
      var variables = []
      var categories = variablesInCategories["categories"]
      for(let i = 0; i < categories.length; i++){
          var singlecategory = variablesInCategories["categories"][i]
          for(let j = 0; j < singlecategory.length; j++){
              variables.push(variablesInCategories["categories"][i][j])
          }
      }
      return variables
    }
  
  }
  export default Minipage;