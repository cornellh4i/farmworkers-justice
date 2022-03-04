import * as d3 from "d3";
import './Histogram.scss';
import { useEffect } from 'react';

interface binProp {
  "start": null | number,
  "end": null | number
}

interface histogramProp {
  height: number;
  width: number;
  //data: number[];
  categoryEncoding: string;
  variableEncoding: string;
  variableDescription: string;
}

interface histogramBinRangesProp {
  "variable-encoding": string,
  "variable-description": string
  "bin-ranges": Array<binProp>
}


const API_URL = process.env.REACT_APP_API;
var data: number[] = [];
//TODO: HANDLE D50MTCOD,G01,G03 AS SPECIAL CASES WITH ENCODING TRANSLATION


function Histogram(props: histogramProp) {

  async function getData() {
    const variableEncoding = props.variableEncoding
    const urlHistogram = `${API_URL}/${variableEncoding}`;
    const histogramResponse = await fetch(urlHistogram);
    const histogramOut = await histogramResponse.json();
    data = histogramOut.data;
    //console.log(data)
  }
  useEffect(() => {
    getData();
  }, []);


  const svg = d3.select("svg#histogram");
  const width = props.width
  const height = props.height;
  const margin = { top: 10, right: 10, bottom: 50, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  let annotations = svg.append("g").attr("id", "annotations");
  let chartArea = svg.append("g").attr("id", "points")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const histogramBinRanges = require('../local-json/histogramBinRanges.json')

  var title = props.variableDescription
  var binRanges = histogramBinRanges["histogram-variables"].find((h: histogramBinRangesProp) =>
    h["variable-encoding"] === props.variableEncoding)["bin-ranges"];
  //console.log(binRanges);


  let maxValue: number = Math.max(...data);
  maxValue = Math.ceil(maxValue / 10) * 10;
  const dataScale = d3.scaleLinear().domain([0, maxValue]).range([0, chartWidth]);
  let total: number[] = []
  let max = 0;
  let i = 0;
  console.log(binRanges)

  // TODO: DO WE NEED TO ALLOCATE THIS MUCH ARRAY MEMORY FOR TOTAL?
  let x = 0;
  for (x = 0; x < binRanges.size; x++) {
    total[binRanges[x]["end"]] = 0;
  }

  // for (i = 10; i <= maxValue + 10; i += 10) {
  //   total[i] = 0;
  // }

  // TODO: USE ONE LOOP (SHOULD BE POSSIBLE)
  // change to use binranges
  data.forEach(d => {
    Object.keys(total).forEach((key: any) => {
      if (d <= key && key - 10 < d) {
        let curr = total[key] + 1;
        if (curr > max)
          max = curr;
        total[key] = curr;
      }
    });
  });

  max = Math.ceil(max / 10) * 10 + 10
  const totalScale = d3.scaleLinear().domain([0, max]).range([chartHeight, 0]);

  let leftAxis = d3.axisLeft(totalScale);
  let leftGridlines = d3.axisLeft(totalScale)
    .tickSize(-chartWidth - 10)
    .tickFormat(d => "");
  annotations.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${margin.left - 10},${margin.top})`)
    .call(leftAxis)
  annotations.append("g")
    .attr("class", "y gridlines")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .call(leftGridlines);

  let bottomAxis = d3.axisBottom(dataScale).tickFormat(d3.format(''));
  let bottomGridlines = d3
    .axisBottom(dataScale)
    .tickSize(-chartHeight)
    .tickFormat(d => "");
  annotations.append("g")
    .attr("class", "x axis")
    .attr('transform', `translate(${margin.left},${chartHeight + margin.top + 10})`)
    .call(bottomAxis);
  annotations.append("g")
    .attr("class", "x gridlines")
    .attr('transform', `translate(${margin.left},${chartHeight + margin.top})`)
    .call(bottomGridlines);
  annotations.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", dataScale(maxValue / 2) + margin.left)
    .attr("y", chartHeight + margin.bottom + 5);
  //.text("Age Groups");

  annotations.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -height / 2 + margin.right)
    .attr("y", dataScale(3))
    .attr("transform", "rotate(-90)");
  //.text("Population Totals");

  Object.keys(total).forEach((key: any) => {
    if (total[key] === 0) {
      delete total[key];
    }

    chartArea.append("rect")
      .attr("class", "histogram")

      .attr("x", dataScale(key - 10))
      .attr("y", totalScale(total[key]))
      .attr("height", chartHeight - totalScale(total[key]))
      .attr("width", dataScale(10));

    chartArea.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "15px")
      .attr("x", dataScale(key - 5))
      .attr('y', totalScale(total[key]) - 5)
      .text(total[key]);
  });

  return (
    <div>
      {props.variableDescription}
      <svg id="histogram" height={props.height} width={props.width}></svg>
    </div>

  );
}

export default Histogram;
