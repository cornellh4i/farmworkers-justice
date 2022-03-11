import * as d3 from "d3";
import './Histogram.scss';
import { useEffect } from 'react';
import { bin, stratify } from "d3";

//
interface binProp {
  "start": null | number,
  "end": null | number
  "start-encoding": null | number
  "end-encoding": null | number
}

interface histogramProp {
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
  const width = 600
  const height = 600
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  //let annotations = svg.append("g").attr("id", "annotations");
  let chartArea = svg.append("g").attr("id", "points")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const histogramBinRanges = require('../local-json/histogramBinRanges.json')

  var title = props.variableDescription
  var binRanges = histogramBinRanges["histogram-variables"].find((h: histogramBinRangesProp) =>
    h["variable-encoding"] === props.variableEncoding)["bin-ranges"];
  //console.log(binRanges);


  let maxValue: number = Math.max(...data);
  maxValue = Math.ceil(maxValue / 10) * 10;
  console.log("max val: " + maxValue)
  const dataScale = d3.scaleLinear().domain([0, binRanges.length * 10]).range([0, chartWidth]);
  let total: number[] = []
  let max = 0;
  let i = 0;
  //console.log(binRanges[0]["end"])

  // TODO: DO WE NEED TO ALLOCATE THIS MUCH ARRAY MEMORY FOR TOTAL?
  let x = 0;

  for (x = 0; x < binRanges.length; x++) {
    //console.log(binRanges[x])
    total[x] = 0;
  }
  //console.log(total)

  // for (i = 10; i <= maxValue + 10; i += 10) {
  //   total[i] = 0;
  // }

  // TODO: USE ONE LOOP (SHOULD BE POSSIBLE)
  // change to use binranges
  data.forEach(d => {
    Object.keys(total).forEach((key: any) => {
      let start = "start";
      let end = "end";
      if (binRanges[key]["start-encoding"] != null) {
        start = "start-encoding"
        end = "end-encoding"
      }
      if (binRanges[key]["start"] == null) {
        if (d <= binRanges[key][end]) {
          let curr = total[key] + 1;
          if (curr > max)
            max = curr;
          total[key] = curr;
        }
      }
      else if (binRanges[key]["end"] == null) {
        if (d >= binRanges[key][start]) {
          let curr = total[key] + 1;
          if (curr > max)
            max = curr;
          total[key] = curr;
        }
      }

      if (d <= binRanges[key][end] && d >= binRanges[key][start]) {
        let curr = total[key] + 1;
        if (curr > max)
          max = curr;
        total[key] = curr;
      }

    });
  });

  console.log(total)

  max = Math.ceil(max / 10) * 10 + 10
  console.log("max: " + max)
  const totalScale = d3.scaleLinear().domain([0, max]).range([chartHeight, 0]);

  //let leftAxis = d3.axisLeft(totalScale);
  // let leftGridlines = d3.axisLeft(totalScale)
  //   .tickSize(-chartWidth - 10)
  //   .tickFormat(d => "");
  // annotations.append("g")
  //   .attr("class", "y axis")
  //   .attr("transform", `translate(${margin.left - 10},${margin.top})`)
  //   .call(leftAxis)
  // annotations.append("g")
  //   .attr("class", "y gridlines")
  //   .attr("transform", `translate(${margin.left},${margin.top})`)
  //   .call(leftGridlines);

  //let bottomAxis = d3.axisBottom(dataScale).tickFormat(d3.format(''));
  // let bottomGridlines = d3
  //   .axisBottom(dataScale)
  //   .tickSize(-chartHeight)
  //   .tickFormat(d => "");
  // annotations.append("g")
  //   .attr("class", "x axis")
  //   .attr('transform', `translate(${margin.left},${chartHeight + margin.top + 10})`)
  //   .call(bottomAxis);
  // annotations.append("g")
  //   .attr("class", "x gridlines")
  //   .attr('transform', `translate(${margin.left},${chartHeight + margin.top})`)
  //   .call(bottomGridlines);
  // annotations.append("text")
  //   .attr("class", "x label")
  //   .attr("text-anchor", "middle")
  //   .attr("x", dataScale(maxValue / 2) + margin.left)
  //   .attr("y", chartHeight + margin.bottom + 5);
  // //.text("Age Groups");

  // annotations.append("text")
  //   .attr("class", "y label")
  //   .attr("text-anchor", "middle")
  //   .attr("x", -height / 2 + margin.right)
  //   .attr("y", dataScale(3))
  //   .attr("transform", "rotate(-90)");
  //.text("Population Totals");
  Object.keys(total).forEach((key: any, index) => {
    let end = binRanges[key]["end"]
    let start = binRanges[key]["start"]

    let diff = end - start


    chartArea.append("rect")
      .attr("class", "histogram")

      .attr("x", dataScale(index * 10))
      .attr("y", totalScale(total[key]))
      .attr("height", chartHeight - totalScale(total[key]))
      .attr("width", dataScale(10));

    chartArea.append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "15px")
      .attr("x", dataScale(index * 10 + 5))
      .attr('y', totalScale(total[key]) - 10)
      .text((start === null ? " " : start) + " - " + (end === null ? " " : end));
  });

  return (
    <div>
      {props.variableDescription}
      <svg id="histogram" height={600} width={600}></svg>
    </div>

  );
}

export default Histogram;
