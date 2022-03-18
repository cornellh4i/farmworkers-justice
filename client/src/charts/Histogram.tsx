import * as d3 from "d3";
import './Histogram.scss';
import { useEffect } from 'react';

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


function Histogram(props: histogramProp) {

  async function getData() {
    const variableEncoding = props.variableEncoding
    const urlHistogram = `${API_URL}/${variableEncoding}`;
    const histogramResponse = await fetch(urlHistogram);
    const histogramOut = await histogramResponse.json();
    data = histogramOut.data;
  }
  useEffect(() => {
    getData();
  }, []);

  const dataSum = data.length;
  const svg = d3.select("svg#histogram");
  const width = 600
  const height = 600
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const chartWidth = width-50 - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  let chartArea = svg.append("g").attr("id", "points")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const histogramBinRanges = require('../local-json/histogramBinRanges.json')

  var title = props.variableDescription
  var binRanges = histogramBinRanges["histogram-variables"].find((h: histogramBinRangesProp) =>
    h["variable-encoding"] === props.variableEncoding)["bin-ranges"];


  let maxValue: number = Math.max(...data);
  maxValue = Math.ceil(maxValue / 10) * 10;
  const dataScale = d3.scaleLinear().domain([0, binRanges.length * 10]).range([0, chartWidth]);
  let total: number[] = []
  let max = 0;
  let i = 0;
  let x = 0;


  for (x = 0; x < binRanges.length; x++) {

    total[x] = 0;
  }

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

  for(let j = 0; j < total.length; j++){
    total[j] = (total[j] / dataSum);
  }
  

  max = ((Math.ceil(max / 10) * 10 + 10) / dataSum)
  const totalScale = d3.scaleLinear().domain([0, max]).range([chartHeight, 0]);
  var percentFormat = d3.format(".0%")
  chartArea.append("g")
    .attr("transform", "translate(50,0)")
    .call(d3.axisLeft(totalScale).tickFormat(d3.format(".0%")));


  Object.keys(total).forEach((key: any, index) => {
    let end = binRanges[key]["end"]
    let start = binRanges[key]["start"]

    let diff = end - start
    
    
    chartArea.append("rect")
      .attr("class", "histogram")
      .attr("transform", "translate(50,0)") 
      .attr("x", dataScale(index * 10))
      .attr("y", totalScale(total[key]))
      
      .attr("height", chartHeight - totalScale(total[key]))
      .attr("width", dataScale(10));

    chartArea.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(50,0)") 
      .attr("font-size", "15px")
      .attr("x", dataScale(index * 10 + 5))
      .attr('y', totalScale(total[key]) - 10)
      .text((start === null ? " " : start) + " - " + (end === null ? " " : end) + " , " + Math.round(total[key]*100) + "%");
    });
  
  return (
    <div>
      <svg id="histogram" height={600} width={600}></svg>
    </div>

  );
}

export default Histogram;
