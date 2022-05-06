import * as d3 from "d3";
import $ from 'jquery';
import './Histogram.scss';
import { useEffect, useRef } from 'react';

interface binProp {
  "start": null | number,
  "end": null | number
  "start-encoding": null | number
  "end-encoding": null | number
}

interface histogramProp {
  variableEncoding: string;
  data: number[],
  index: number
}

interface histogramBinRangesProp {
  "variable-encoding": string,
  "variable-description": string
  "bin-ranges": Array<binProp>
}

function Histogram(props: histogramProp) {
  const histogramBinRanges = require('../local-json/histogramBinRanges.json')
  const maxHeight = 400;

  // TODO: FIX GRAPH DOESNT SHOW UP WHEN DROPDOWN SWITCHES WHEN IT IS NOT COLLAPSED 
  useEffect(() => {
    const dataSum = props.data.length;
    var binRanges: binProp[] = histogramBinRanges["histogram-variables"].find((h: histogramBinRangesProp) =>
      h["variable-encoding"] === props.variableEncoding)["bin-ranges"];
  
    let maxValue: number = Math.max(...props.data);
    maxValue = Math.ceil(maxValue / 10) * 10;
    // const xScale = d3.scaleLinear().domain([0, binRanges.length * 10]).range([0, chartWidth]);
    let total: number[] = []
    let x = 0;
  
    for (x = 0; x < binRanges.length; x++) {
      total[x] = 0;
    }
    // TODO: FIX SORTING FOR VARIALBES WITH ENCODINGS
    props.data.forEach(d => {
      total.forEach((element, index) => {
        let start = "start";
        let end = "end";
        if (binRanges[index]["start-encoding"] != null) {
          if (binRanges[index].start == null) {
            if (d <= binRanges[index]["end-encoding"]!) {
              let curr = total[index] + 1;
              total[index] = curr;
            }
          }
          else if (binRanges[index].end == null) {
            if (d >= binRanges[index]["start-encoding"]!) {
              let curr = total[index] + 1;
              total[index] = curr;
            }
          }
    
          if (d <= binRanges[index]["end-encoding"]! && d >= binRanges[index]["start-encoding"]!) {
            let curr = total[index] + 1;
            total[index] = curr;
          }
        } else {
          if (binRanges[index].start == null) {
            if (d <= binRanges[index]["end"]!) {
              let curr = total[index] + 1;
              total[index] = curr;
            }
          }
          else if (binRanges[index].end == null) {
            if (d >= binRanges[index]["start"]!) {
              let curr = total[index] + 1;
              total[index] = curr;
            }
          }
    
          if (d <= binRanges[index]["end"]! && d >= binRanges[index]["start"]!) {
            let curr = total[index] + 1;
            total[index] = curr;
          }
        }
      });
    });
  let maxBin = 0;
  for (let j = 0; j < total.length; j++) {
    total[j] = (total[j] / dataSum);
    if (total[j] > maxBin) {
      maxBin = total[j] 
    }
  }

  var chart = $(`#histogram${props.index}`),
  aspect = chart.width()!  / chart.height()!,
  container = chart.parent();
$(window).on("resize", function() {
  var targetWidth = container.width();
  chart.attr("width", targetWidth!);
  chart.attr("height", Math.round(targetWidth! / aspect));
}).trigger("resize");


  // Updates the visualization 
  function update(total: number[]) {
    var yScale = d3.scaleLinear().domain([0, maxBin]).range([maxHeight, 0]);
    const xScale = d3.scaleLinear().domain([0, binRanges.length]).range([0, binRanges.length * 100 + 10]); // +10 due to chart transform
    var axis = d3.select<SVGSVGElement, unknown>(`#axis${props.index}`)
    axis.call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")))

    // Update selection: Resize and position existing 
    // DOM elements with data bound to them.
    var selection = d3.select(`#histogram${props.index}`)

    var bins = selection
      .selectAll(".bar")
      .data(total)
      .style("height", function(d){ 
        return d/maxBin*maxHeight + "px"; 
      })
      .style("margin-top", function(d){ 
        return (maxHeight - d/maxBin*maxHeight) + "px"; 
      });
    
    // Enter selection: Create new DOM elements for added 
    // data items, resize and position them and attach a 
    // mouse click handler.
    bins.enter()
      .append("div")
      .attr("class", "bar")
      .style("height", function(d){ 
        return d/maxBin*maxHeight + "px"; 
      })
      .style("margin-top", function(d){ 
        return (maxHeight - d/maxBin*maxHeight) + "px"; 
      });

    // Exit selection: Remove elements without data from the DOM
    bins.exit().remove();

    var labels = selection 
      .selectAll('.text')
      .data(binRanges)
      .style("font-size", "12px")
      .style("position", "fixed")
      .style("text-align", "center")
      .style("width", "100px") // corresponding to bar width
      .style("left", function(d, i) { return xScale(i) + "px"})
      .style('top', function(d, i) { return yScale(total[i]) - 30 + "px"}) //-30 to go two rows above bar
      .text(function(d, i) { return (d.start === null ? " " : d.start) + " - " + (d.end === null ? " " : d.end) + " , " + Math.round(total[i] * 100) + "%"});

    labels.enter()
      .append("text")
      .attr("class", "text")
      .style("font-size", "12px")
      .style("position", "fixed")
      .style("text-align", "center")
      .style("width", "100px") // corresponding to bar width
      .style("left", function(d, i) { return xScale(i) + "px"})
      .style('top', function(d, i) { return yScale(total[i]) - 30 + "px"}) //-30 to go two rows above bar
      .text(function(d, i) { return (d.start === null ? " " : d.start) + " - " + (d.end === null ? " " : d.end) + " , " + Math.round(total[i] * 100) + "%"});

    labels.exit().remove();
  };
  
  update(total)
  }, [props.data])
  
  return (
    <div className="histogram-container"> 
      <svg width="60px" height="500px">
        <g id={`axis${props.index}`} transform="translate(30, 40)"></g>
      </svg>
      <div id={`histogram${props.index}`} style={{width: '1000px', height: '400px', marginBottom: '20px', transform: "translate(10px, 40px)"}}></div>
    </div>

  );
}

export default Histogram;
