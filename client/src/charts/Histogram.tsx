import * as d3 from "d3";
import './Histogram.scss';
import { useEffect, useRef } from 'react';

interface binProp {
  "start": null | number,
  "end": null | number
  "start-encoding": null | number
  "end-encoding": null | number
}

interface histogramProp {
  categoryEncoding: number;
  variableEncoding: string;
  data: number[]
}

interface histogramBinRangesProp {
  "variable-encoding": string,
  "variable-description": string
  "bin-ranges": Array<binProp>
}

function Histogram(props: histogramProp) {
  const histogramBinRanges = require('../local-json/histogramBinRanges.json')
  const maxHeight = 400;

  useEffect(() => {
    const dataSum = props.data.length;
    var binRanges = histogramBinRanges["histogram-variables"].find((h: histogramBinRangesProp) =>
      h["variable-encoding"] === props.variableEncoding)["bin-ranges"];
  
    let maxValue: number = Math.max(...props.data);
    maxValue = Math.ceil(maxValue / 10) * 10;
    // const xScale = d3.scaleLinear().domain([0, binRanges.length * 10]).range([0, chartWidth]);
    let total: number[] = []
    let x = 0;
  
    for (x = 0; x < binRanges.length; x++) {
      total[x] = 0;
    }
  
    props.data.forEach(d => {
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
            total[key] = curr;
          }
        }
        else if (binRanges[key]["end"] == null) {
          if (d >= binRanges[key][start]) {
            let curr = total[key] + 1;
            total[key] = curr;
          }
        }
  
        if (d <= binRanges[key][end] && d >= binRanges[key][start]) {
          let curr = total[key] + 1;
          total[key] = curr;
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
  // Updates the visualization 
  function update(total: number[]) {
    var yScale = d3.scaleLinear().domain([0, maxBin]).range([maxHeight, 0]);
    var axis = d3.select<SVGSVGElement, unknown>("svg g")
    axis.call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")))

    // Update selection: Resize and position existing 
    // DOM elements with data bound to them.
    var selection = d3.select("#chart")
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
    selection.enter()
      .append("div")
      .attr("class", "bar")
      .style("height", function(d){ 
        return d/maxBin*maxHeight + "px"; 
      })
      .style("margin-top", function(d){ 
        return (maxHeight - d/maxBin*maxHeight) + "px"; 
      });

    // Exit selection: Remove elements without data from the DOM
    selection.exit().remove();

      // Print underlying data array
      // d3.selectAll("#total")
      // .data(total)
      // .enter()
      // .append('text')
      // .attr("x", function(d,i){return 100 * (i % 3)})
      // .attr("y", function(d,i){return 20 * ( Math.floor(i/3) ) })
      // .text(function(d) {return d});

    };
  update(total)
    
      //   chartArea.append("text")
      //     .attr("text-anchor", "middle")
      //     .attr("transform", "translate(50,0)")
      //     .attr("font-size", "15px")
      //     .attr("x", xScale(index * 10 + 5))
      //     .attr('y', yScale(total[key]) - 10)
      //     .text((start === null ? " " : start) + " - " + (end === null ? " " : end) + " , " + Math.round(total[key] * 100) + "%");    });
      // }
  }, [props.data])
  
  return (
    <div className="histogram-container"> 
      <svg width="60px" height="500px">
        <g id="axis" transform="translate(30, 40)"></g>
      </svg>
      <div id="chart"></div>
    </div>

  );
}

export default Histogram;
