import CategoryCard from "./CategoryCard";

function Homepage () {
    return (
        <div>
            <h2>Visualization of Data from the</h2>
            <h1>National Agricultural Workers Survey (NAWS)</h1>
            <CategoryCard categoryTitle="Birthplace, Work Authorization, and Migrant Types"/>
            <CategoryCard categoryTitle="Demographics, Family Size, Children, and Household Structure"/>
        </div>
    )
}

export default Homepage;