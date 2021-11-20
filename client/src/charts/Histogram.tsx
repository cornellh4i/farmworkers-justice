import * as d3 from "d3";

interface histogramProp {
  height : number;
  width : number;
  data : number [];
}

function Histogram (props : histogramProp) {
  const svg = d3.select("svg#histogram");
  const width = props.width
  const height = props.height;
  const margin = {top: 10, right: 10, bottom: 50, left: 60};
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  let annotations = svg.append("g").attr("id","annotations");
  let chartArea = svg.append("g").attr("id","points")
    .attr("transform",`translate(${margin.left},${margin.top})`);

  let data : Array<number> = props.data;
  console.log(data);
  const maxAge : number= Math.max(...data);
  const ageScale = d3.scaleLinear().domain([0, maxAge]).range([0, chartWidth]);
  let total : number[] = []
  let max = 0; 
  let i = 0;
  for (i = 10; i<=maxAge; i+=10){
    total[i] = 0;
  }
  data.forEach( age => {
  Object.keys(total).forEach ((key : any )=> {
    if (age <= key && key-10 < age){
      let curr = total[key] + 1;
    if (curr > max)
      max = curr;
      total[key] = curr;
    }
    });
  });
  
  console.log(total);
  max = Math.ceil(max / 10) * 10 + 10
  const totalScale = d3.scaleLinear().domain([0, max]).range([chartHeight, 0]);

  let leftAxis = d3.axisLeft(totalScale);
  let leftGridlines = d3.axisLeft(totalScale)
          .tickSize(-chartWidth-10)
          .tickFormat(d => "");
  annotations.append("g")
    .attr("class", "y axis")
    .attr("transform",`translate(${margin.left-10},${margin.top})`)
    .call(leftAxis)
  annotations.append("g")
    .attr("class", "y gridlines")
    .attr("transform",`translate(${margin.left},${margin.top})`)
    .call(leftGridlines);

  let bottomAxis = d3.axisBottom(ageScale).tickFormat(d3.format(''));
  let bottomGridlines = d3
    .axisBottom(ageScale)
    .tickSize(-chartHeight )
    .tickFormat(d => "");
  annotations.append("g")
    .attr("class", "x axis")
    .attr('transform',`translate(${margin.left},${chartHeight + margin.top + 10})`) 
    .call(bottomAxis);
  annotations.append("g")
    .attr("class", "x gridlines")
    .attr('transform',`translate(${margin.left},${chartHeight + margin.top})`) 
    .call(bottomGridlines);

  annotations.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", ageScale(maxAge/2) + margin.left ) 
    .attr("y", chartHeight + margin.bottom+ 5)
    .text("Age Groups");

  annotations.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -height/2+ margin.right) 
    .attr("y", ageScale(3))
    .attr("transform", "rotate(-90)")
    .text("Population Totals");

  Object.keys(total).forEach ((key : any)=> {
  chartArea.append("rect")
    .attr("x",ageScale( key-10 ))
    .attr("y",totalScale(total[key]) )
    .attr("height", chartHeight -totalScale(total[key]))
    .attr("width",ageScale( 10 ) )
    .style("stroke", "gray" )
    .style("fill", "pink" );

  chartArea.append("text")
    .attr("text-anchor","middle")
    .attr("font-size","15px")
    .attr("x",ageScale(key -5))
    .attr('y',totalScale(total[key]) - 5)
    .text(total[key]);
  });


  return (
    <svg id = "histogram" height = {props.height} width = {props.width}></svg>
  );
}
export default Histogram;
