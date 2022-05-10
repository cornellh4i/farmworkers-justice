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

  useEffect(() => {
    var binRanges: binProp[] = histogramBinRanges["histogram-variables"].find((h: histogramBinRangesProp) =>
      h["variable-encoding"] === props.variableEncoding)["bin-ranges"];
    let maxBin = 0;
    for (let j = 0; j < props.data.length; j++) {
      if (props.data[j] > maxBin) {
        maxBin = props.data[j]
      }
    }

    // Updates the visualization 
    function update(total: number[]) {
      var yScale = d3.scaleLinear().domain([0, maxBin]).range([maxHeight, 0]);
      const xScale = d3.scaleLinear().domain([0, binRanges.length]).range([0, binRanges.length * 80 + 10]); // +10 due to chart transform
      var axis = d3.select<SVGSVGElement, unknown>(`#axis${props.index}`)
      axis.call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")))

      // Update selection: Resize and position existing 
      // DOM elements with data bound to them.
      var selection = d3.select(`#histogram${props.index}`)

      var bins = selection
        .selectAll(".bar")
        .data(total)
        .style("height", function (d) {
          return d / maxBin * maxHeight + "px";
        })
        .style("margin-top", function (d) {
          return (maxHeight - d / maxBin * maxHeight) + "px";
        });

      // Enter selection: Create new DOM elements for added 
      // data items, resize and position them and attach a 
      // mouse click handler.
      bins.enter()
        .append("div")
        .attr("class", "bar")
        .style("height", function (d) {
          return d / maxBin * maxHeight + "px";
        })
        .style("margin-top", function (d) {
          return (maxHeight - d / maxBin * maxHeight) + "px";
        });

      // Exit selection: Remove elements without data from the DOM
      bins.exit().remove();

      var labels = selection
        .selectAll('.text')
        .data(binRanges)
        .style("font-size", "12px")
        .style("position", "fixed")
        .style("text-align", "center")
        .style("width", "80px") // corresponding to bar width
        .style("left", function (d, i) { return xScale(i) + "px" })
        .style('top', function (d, i) { return yScale(total[i]) - 30 + "px" }) //-30 to go two rows above bar
        .text(function (d, i) { return (d.start === null ? " " : d.start) + " - " + (d.end === null ? " " : d.end) + " , " + Math.round(total[i] * 100) + "%" });


      labels.enter()
        .append("text")
        .attr("class", "text")
        .style("font-size", "12px")
        .style("position", "fixed")
        .style("text-align", "center")
        .style("width", "80px") // corresponding to bar width
        .style("left", function (d, i) { return xScale(i) + "px" })
        .style('top', function (d, i) { return yScale(total[i]) - 30 + "px" }) //-30 to go two rows above bar
        .text(function (d, i) { return (d.start === null ? " " : d.start) + " - " + (d.end === null ? " " : d.end) + " , " + Math.round(total[i] * 100) + "%" });

      labels.exit().remove();
    };

    update(props.data)
  }, [props.data])

  return (
    <div className="histogram-container">
      <svg width="60px" height="500px">
        <g id={`axis${props.index}`} transform="translate(30, 40)"></g>
      </svg>
      <div id={`histogram${props.index}`} style={{ width: '1000px', height: '400px', marginBottom: '20px', transform: "translate(10px, 40px)" }}></div>
    </div>

  );
}

export default Histogram;
